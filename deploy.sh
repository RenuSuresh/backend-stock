git pull
app_id=$(ps -ef | grep 'app.js' | grep -v 'grep' | awk '{ printf $2 }')
sudo kill $app_id
echo Killed Application and Starting New ...
echo --------------------------------------------------------------------------------------------------------------
nohup node app.js &