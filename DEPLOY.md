# 部署到 GitHub Pages

專案已經 `git init` 並完成第一次 commit，接下來只剩「建 repo → push → 開 Pages」三步。

---

## 步驟 1 · 在 GitHub 建立空的 repo

到 <https://github.com/new>，填：

| 欄位 | 填什麼 |
| --- | --- |
| Repository name | `insurance-quiz` |
| Public / Private | **Public**（免費帳號的 Pages 需要公開；私人 repo 要 Pro） |
| Add a README file | **不要勾** |
| Add .gitignore | **None** |
| Choose a license | **None** |

後面三項一定要留空，否則 GitHub 會先建一個 commit，跟你本機的對不上，push 會被擋。

建好後不要照著頁面上的指令做，回來看步驟 2。

---

## 步驟 2 · push 上去

打開「終端機」，把 `你的帳號` 換成實際的 GitHub 帳號，整段貼上：

```bash
cd ~/Documents/保險/insurance-quiz
git remote add origin https://github.com/你的帳號/insurance-quiz.git
git push -u origin main
```

### 如果它問你帳號密碼

GitHub 從 2021 年起就不收密碼了。三種做法挑一種：

1. **GitHub CLI（最省事）** — 裝好後跑 `gh auth login`，跟著指示在瀏覽器授權一次，之後 push 都不用再輸入
   ```bash
   brew install gh && gh auth login
   ```
2. **Personal Access Token** — 到 <https://github.com/settings/tokens> 產一組（勾 `repo` 權限），push 時「密碼」欄位貼 token
3. **SSH 金鑰** — 已經設定過 SSH 的話，remote 改用 `git@github.com:你的帳號/insurance-quiz.git`

> 這一步請你自己操作。金鑰、token、密碼我不會也不該經手。

### 如果 git 抱怨還沒設定身分

```bash
git config --global user.name "你的名字"
git config --global user.email "你的信箱"
```

---

## 步驟 3 · 打開 GitHub Pages

1. 進到 repo 頁面 → 上方 **Settings**
2. 左邊選單捲到 **Pages**
3. **Source** 選 `Deploy from a branch`
4. **Branch** 選 `main`，資料夾選 `/ (root)` → **Save**

等 1〜2 分鐘（repo 的 Actions 分頁可以看進度），網址就是：

```
https://你的帳號.github.io/insurance-quiz/
```

---

## 步驟 4 · 裝到 iPhone 主畫面

1. 用 **Safari** 開上面的網址（Chrome 不行，iOS 只有 Safari 能加主畫面）
2. 底部「分享」按鈕 → 往下捲 → **加入主畫面**
3. 從主畫面開啟就是全螢幕、沒有網址列，而且**完全離線可用**

第一次開啟會下載約 900 KB（題庫都在裡面），之後就存在裝置上了。

Android 用 Chrome 開，網址列會自己跳出「安裝應用程式」。

---

## 日後要改東西

改完檔案後：

```bash
cd ~/Documents/保險/insurance-quiz
git add -A
git commit -m "簡短描述改了什麼"
git push
```

推上去約 1 分鐘後線上就更新了。

**改到 `index.html` 的話**，記得同時把 `sw.js` 最上面的版本號往上加：

```js
const VERSION = 'v2.0.1';   // ← 改這裡
```

不改版本號的話，已經裝在手機上的舊版會繼續用快取，看不到你的更新。

---

## 兩件小事

- **作答紀錄不會跟著搬家。** 紀錄存在瀏覽器的 localStorage，是綁網址的。之前在電腦上用 `file://` 開時累積的進度，不會出現在 GitHub Pages 的版本裡；反過來也一樣。
- **repo 是公開的。** 題目內容會被任何人看到，也會被搜尋引擎索引。若不希望公開，需要 GitHub Pro 才能對私人 repo 開 Pages，或改用 Cloudflare Pages、Netlify 這類支援私人 repo 免費部署的服務。
