# VSCode Tooling

We use VSCode for development because it is the best open source option and actively maintained by Microsoft. The extensions we user provides the following productivity boosters:

1. [Apollo GraphQL syntax highlighting](https://github.com/prisma-labs/vscode-graphql)
2. [NodeJS Chrome Debugger](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
3. [ESLint Code Cleaniness Enforcer](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
4. [Prettier Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) automatically cleans your code styling upon save
5. Some configs in your VSCode `settings.json` that will auto-update your code import statements whenever you change a file's name or folder location.
6. [Restore Git Branch Tabs](https://marketplace.visualstudio.com/items?itemName=gkotas.restore-git-branch-tabs) will remember the tabs you had open on a certain branch. Great for context switching.
7. Typescript type checks comes free with Typescript. While typing, you can see what functions or variables are available to you in realtime without needing to run the code.
8. [Terraform syntax highlight](https://github.com/mauve/vscode-terraform)

Your VSCode `settings.json` should include the following configs. Note that the VSCode `settings.json` differs per person, and is not committed to git. It exists on some local location such as `C://yourcomputer/.../~/Library/Application Support/Code/User/settings.json`. You can also press `Cmd + ,` in VSCode to get to your settings. Make sure you have the JSON view instead of the GUI view.

```
{
    "javascript.updateImportsOnFileMove.enabled": "always",
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true
    },
    "[typescriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true
    },
    "typescript.updateImportsOnFileMove.enabled": "always",
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact"
    ],
    "eslint.workingDirectories": [
        {
        "mode": "auto"
        }
    ],
}
```

Configure your VSCode with the above extensions and settings and get developer superpowers!
