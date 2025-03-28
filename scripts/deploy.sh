# adapt output dir, where your generated static vueJS files shall be copied in 
DIST_DIR=/home/pythbuster/dev/python/savings_manager/static

cd ..
npm run build
cp -r dist/* $DIST_DIR