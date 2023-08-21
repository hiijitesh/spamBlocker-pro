
npm install husky -D
npx husky-init

npx husky add .husky/commit-msg 'npx --no-install commitlint --edit'

npm install @commitlint/config-conventional @commitlint/cli -D

# create file
touch .commitlintrc.json

npm install lint-staged -D
# add this line to package.json
# "pre-commit": "lint-staged"

touch .lintstagedrc-prettier

touch .lintstagedrc-eslint


#for installing prettier:
npm install --save-dev --save-exact prettier
#for installing eslint:
npm install eslint --save-dev

#debug
npm cache clean --force
# replace head with commit id
npx commitlint --from=HEAD~1
