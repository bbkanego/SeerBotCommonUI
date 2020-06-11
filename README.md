# MyComponentLibrary

This component library provides a shared library of commonly used components which can be included in your Angular projects. The components include various widgets, validation etc.

## Test components
1. wewe
2. Next start the app using 'npm run start'

## How to deploy the component library
> To deploy run the below commands
```
Angular-Library-With-NgPackagr bkane$ npm run packagr
Angular-Library-With-NgPackagr bkane$ npm pack ./dist
ProjectToInstallIN bkane$ npm install ../Angular-Library-With-NgPackagr/my-component-library-0.0.0.tgz
```

## Upgrade from Angular 5 to 6:

References:
1. https://medium.com/@jeroenouw/upgrade-to-angular-6-4520e46c682b
2. https://stackoverflow.com/questions/50232874/angular-6-migration-angular-cli-json-to-angular-json
3. https://update.angular.io/#5.2:6.1l3

Make sure that you install the CLI @^6 globally and then update it:

```
sudo npm install -g @angular/cli@^6
/**
for this do not include the version. This will create angular.json and update package.json
**/
ng update @angular/cli^6
ng update @angular/core@^6
ng update
```

Next update other dependencies:
```
npm install @angular/animations@^6 @angular/common@^6 @angular/compiler@^6 @angular/core@^6 @angular/forms@^6 @angular/http@^6 @angular/platform-browser@^6 @angular/platform-browser-dynamic@^6 @angular/platform-server@^6 @angular/router@^6 --save

npm install @angular-devkit/build-angular@^0.12.4 @angular-devkit/build-ng-packagr@^0.901.7  @angular-devkit/build-optimizer@latest @angular/cli@^6 @angular/compiler-cli@^6 @angular/language-service@^6 --save-dev

npm install core-js@latest zone.js@latest --save

npm install @types/jasmine@latest @types/node@latest codelyzer@latest karma@latest karma-chrome-launcher@latest karma-cli@latest karma-jasmine@latest karma-jasmine-html-reporter@latest jasmine-core@latest jasmine-spec-reporter@latest protractor@latest tslint@latest --save-dev

npm install rxjs@latest rxjs-compat@latest --save

npm install rxjs-tslint@latest --save-dev

./node_modules/rxjs-tslint/bin/rxjs-5-to-6-migrate -p src/tsconfig.app.json

npm install webpack@latest --save-dev

npm update

npm install --save core-js@^2.5.0
```

## Upgrade from Angular 6 to 7
Run the below commands
```
npm install @angular/animations@^7 @angular/common@^7 @angular/compiler@^7 @angular/core@^7 @angular/forms@^7 @angular/http@^7 @angular/platform-browser@^7 @angular/platform-browser-dynamic@^7 @angular/platform-server@^7 @angular/router@^7 --save

npm install @angular/compiler-cli@^7 @angular/cli@^7 @angular/language-service@^7 --save-dev

npm install core-js@latest zone.js@latest --save

npm install typescript@latest --save-dev

npm install rxjs@latest rxjs-compat@latest --save
```

## Upgrade from Angular 7 to 8
```
// upgrade to latest NPM
sudo npm cache clean -f
sudo npm install -g n
sudo n stable

npm install @angular/animations@^8 @angular/common@^8 @angular/compiler@^8 @angular/core@^8 @angular/forms@^8 @angular/platform-browser@^8 @angular/platform-browser-dynamic@^8 @angular/platform-server@^8 @angular/router@^8

npm install @angular-devkit/build-angular@0.800.0 @angular/compiler-cli@^8 @angular/cli@^8 @angular/language-service@^8 --save-dev

```
