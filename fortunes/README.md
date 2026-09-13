在 ~/.bashrc 或 ~/.zshrc 文件（根据你使用的 shell 而定）的结尾，加上下面几行，那么每次启动 shell 窗口，就会自动跳出一句格言。


```bash
#!/bin/bash
cd $HOME/.local/share/fontunes/
echo
echo "=============== Quote Of The Day ==============="
echo
fortune 20% chinese 10% diet 10% fortunes 10% jade-aphorism 10% jade-scripts 20% song100 20% tang300
echo
echo "================================================"
echo
```
