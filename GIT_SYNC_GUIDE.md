# How to Sync Obsidian Git with your Blog

If Git is rejecting your commits or pushes from Obsidian (e.g. saying "Updates were rejected because the remote contains work that you do not have locally"), don't worry! This is a standard and safe Git behavior.

Here is exactly what is happening and how to fix it in 5 seconds.

---

## 🔍 Why is it not letting you commit/push?

1. **Design Updates in AI Studio**: We made visual layout and desktop alignment improvements here in AI Studio. These changes were automatically committed and pushed to your remote GitHub repository.
2. **Commit Divergence**: Your local team (Obsidian on your computer) does not have these new style changes yet. 
3. **Git Protection**: Because the remote GitHub repository contains new commits (our design fixes) that your local Obsidian workspace lacks, Git prevents you from pushing to avoid overwriting anything.

---

## ⚡ The 2-Step Solution

To synchronize everything, simply fetch our visual updates to your local computer first:

1. **Pull the latest changes**:
   - **Using Obsidian Git Plugin**: Click on your command palette (`Ctrl+P` or `Cmd+P`), type `Obsidian Git: Pull`, and press Enter.
   - **Using Terminal**: Run `git pull` in your blog repository folder on your computer.
2. **Commit and Push**:
   - Now that your local Obsidian has our style improvements, you can securely commit and push your new markdown posts to GitHub. They will automatically sync with this AI Studio applet!

---

## 🛡️ Safe & Non-Destructive Workspace

* **No Deletion**: We have updated the build and deployment scripts. Your posts in `src/content/posts/` are treated as completely read-only by our build process and will **never** be cleaned, wiped, or deleted during updates.
* **Bi-directional Sync**: Any time you push a `.md` post from Obsidian, AI Studio fetches it, and any time we refine the UI layout, you can simply pull it to your computer.
