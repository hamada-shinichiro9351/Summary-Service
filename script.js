// Google Gemini API設定
const GEMINI_API_KEY = 'AIzaSyCSgQ69xViEBucKWHv3w7J67ceQxrlgHBo';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';

// DOM要素
const urlForm = document.getElementById('urlForm');
const urlInput = document.getElementById('urlInput');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const loadingSpinner = submitBtn.querySelector('.loading-spinner');
const resultSection = document.getElementById('resultSection');
const summaryText = document.getElementById('summaryText');
const originalUrl = document.getElementById('originalUrl');
const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');

// フォーム送信イベント
urlForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const url = urlInput.value.trim();
    
    if (!url) {
        showError('URLを入力してください');
        return;
    }
    
    if (!isValidUrl(url)) {
        showError('有効なURLを入力してください');
        return;
    }
    
    await summarizeUrl(url);
});

// URLの妥当性チェック
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// ローディング状態の管理
function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    btnText.style.display = isLoading ? 'none' : 'inline';
    loadingSpinner.style.display = isLoading ? 'inline' : 'none';
}

// エラー表示
function showError(message) {
    hideResults();
    errorMessage.textContent = message;
    errorSection.style.display = 'block';
}

// 結果表示
function showResult(summary, url) {
    hideResults();
    summaryText.textContent = summary;
    originalUrl.textContent = url;
    originalUrl.href = url;
    resultSection.style.display = 'block';
}

// 結果を隠す
function hideResults() {
    resultSection.style.display = 'none';
    errorSection.style.display = 'none';
}

// URLの内容を取得
async function fetchUrlContent(url) {
    try {
        // より信頼性の高いプロキシサービスを使用
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        
        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            }
        });
        
        if (response.ok) {
            const content = await response.text();
            // HTMLタグを除去してテキストのみを抽出
            const textContent = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                                    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                                    .replace(/<[^>]*>/g, ' ')
                                    .replace(/\s+/g, ' ')
                                    .trim();
            return textContent;
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('URL取得エラー:', error);
        // エラーが発生しても空文字を返して、URLから推測する処理に進む
        return '';
    }
}

// Gemini APIを使用して要約
async function summarizeWithGemini(content, url) {
    try {
        console.log('Gemini API呼び出し開始');
        
        // 内容が空または短すぎる場合の処理
        if (!content || content.length < 10) {
            console.log('URLから推測モード');
            // URLから直接要約を試行
            const urlPrompt = `
以下のURLのウェブページについて、1行（50文字以内）で要約してください。
URL: ${url}

URLの内容が取得できない場合は、URLのドメイン名やパスから推測して、そのサイトの一般的な内容を要約してください。
例えば：
- github.com → ソフトウェア開発のプラットフォーム
- wikipedia.org → オンライン百科事典
- stackoverflow.com → プログラマー向けQ&Aサイト
- google.com → 検索エンジン

要約は日本語で、簡潔で分かりやすく、要点を押さえたものにしてください。
`;
            
            console.log('APIリクエスト送信...');
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: urlPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 100
                    }
                })
            });
            
            console.log('APIレスポンス:', response.status, response.statusText);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('APIエラー詳細:', errorData);
                throw new Error(`API エラー: ${errorData.error?.message || '不明なエラー'}`);
            }
            
            const data = await response.json();
            console.log('APIレスポンス成功:', data);
            return data.candidates[0].content.parts[0].text.trim();
        }
        
        const prompt = `
以下のウェブページの内容を1行（50文字以内）で要約してください。
URL: ${url}

内容:
${content.substring(0, 3000)} // 内容が長すぎる場合は最初の3000文字のみ使用

要約は日本語で、簡潔で分かりやすく、要点を押さえたものにしてください。
`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
                            body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 100
                    }
                })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API エラー: ${errorData.error?.message || '不明なエラー'}`);
        }

        const data = await response.json();
        const summary = data.candidates[0].content.parts[0].text.trim();
        
        return summary;
    } catch (error) {
        console.error('Gemini API エラー:', error);
        throw new Error('AIによる要約に失敗しました。しばらく時間をおいて再試行してください。');
    }
}

// メインの要約処理
async function summarizeUrl(url) {
    setLoading(true);
    hideResults();
    
    try {
        console.log('要約処理開始:', url);
        
        // URLの内容を取得（失敗しても空文字が返される）
        const content = await fetchUrlContent(url);
        console.log('URL内容取得完了:', content ? content.length : 0, '文字');
        
        // Gemini APIで要約
        const summary = await summarizeWithGemini(content, url);
        console.log('要約完了:', summary);
        
        // 結果を表示
        showResult(summary, url);
        
    } catch (error) {
        console.error('要約エラー詳細:', error);
        console.error('エラースタック:', error.stack);
        showError(`要約処理中にエラーが発生しました: ${error.message}`);
    } finally {
        setLoading(false);
    }
}

// APIキーの検証
async function validateApiKey() {
    try {
        console.log('APIキー検証開始...');
        console.log('使用するURL:', `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`);
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: "こんにちは"
                }]
            }]
        };
        
        console.log('リクエストボディ:', JSON.stringify(requestBody, null, 2));
        
        const testResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('APIレスポンス:', testResponse.status, testResponse.statusText);
        
        if (!testResponse.ok) {
            const errorData = await testResponse.json();
            console.error('APIキー検証エラー:', errorData);
            showError(`APIキーが無効です: ${errorData.error?.message || '不明なエラー'}`);
            return false;
        }
        
        const data = await testResponse.json();
        console.log('API検証成功:', data);
        return true;
    } catch (error) {
        console.error('APIキー検証エラー:', error);
        showError(`APIキーの検証に失敗しました: ${error.message}`);
        return false;
    }
}

// ページ読み込み時にAPIキーを検証
document.addEventListener('DOMContentLoaded', async () => {
    if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
        showError('Google Gemini APIキーを設定してください。script.jsファイルのGEMINI_API_KEYを実際のAPIキーに置き換えてください。');
    } else {
        console.log('設定されたAPIキー:', GEMINI_API_KEY.substring(0, 10) + '...');
        console.log('APIエンドポイント:', GEMINI_API_URL);
        await validateApiKey();
    }
});

// 入力フィールドのリアルタイムバリデーション
urlInput.addEventListener('input', () => {
    if (urlInput.value.trim()) {
        urlInput.style.borderColor = '#667eea';
    } else {
        urlInput.style.borderColor = '#e1e5e9';
    }
}); 
