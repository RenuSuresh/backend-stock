app_id=$(ps -ef | grep 'app.js' | grep -v 'grep' | awk '{ printf $2 }')
sudo kill $app_id
echo Successfully Killed Application...
