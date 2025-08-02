// Google Gemini API設定
const GEMINI_API_KEY = 'AIzaSyALi45AZVhyfkV0xAzwBfU4Wwefz9muJuo';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

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
        // 複数のプロキシサービスを試行
        const proxyServices = [
            `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
            `https://cors-anywhere.herokuapp.com/${url}`,
            `https://thingproxy.freeboard.io/fetch/${url}`
        ];
        
        for (const proxyUrl of proxyServices) {
            try {
                const response = await fetch(proxyUrl, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    timeout: 10000
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.contents) {
                        return data.contents;
                    } else if (data.text) {
                        return data.text;
                    } else {
                        const text = await response.text();
                        return text;
                    }
                }
            } catch (proxyError) {
                console.log(`プロキシサービスエラー: ${proxyUrl}`, proxyError);
                continue;
            }
        }
        
        throw new Error('すべてのプロキシサービスでURLの取得に失敗しました');
    } catch (error) {
        console.error('URL取得エラー:', error);
        throw new Error('URLの内容を取得できませんでした。一部のサイトではセキュリティ設定により取得できない場合があります。URLが正しいか確認してください。');
    }
}

// Gemini APIを使用して要約
async function summarizeWithGemini(content, url) {
    try {
        // 内容が空または短すぎる場合の処理
        if (!content || content.length < 10) {
            // URLから直接要約を試行
            const urlPrompt = `
以下のURLのウェブページについて、1行（50文字以内）で要約してください。
URL: ${url}

URLの内容が取得できない場合は、URLのドメイン名やパスから推測して、そのサイトの一般的な内容を要約してください。
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
                            text: urlPrompt
                        }]
                    }]
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API エラー: ${errorData.error?.message || '不明なエラー'}`);
            }
            
            const data = await response.json();
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
                }]
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
        // URLの内容を取得
        const content = await fetchUrlContent(url);
        
        // Gemini APIで要約
        const summary = await summarizeWithGemini(content, url);
        
        // 結果を表示
        showResult(summary, url);
        
    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
}

// APIキーの設定を促すメッセージ
if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    showError('Google Gemini APIキーを設定してください。script.jsファイルのGEMINI_API_KEYを実際のAPIキーに置き換えてください。');
}

// 入力フィールドのリアルタイムバリデーション
urlInput.addEventListener('input', () => {
    if (urlInput.value.trim()) {
        urlInput.style.borderColor = '#667eea';
    } else {
        urlInput.style.borderColor = '#e1e5e9';
    }
}); 

