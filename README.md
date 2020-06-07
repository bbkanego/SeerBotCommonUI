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

Make sure that you install the CLI @6 globally and then update it:

```
sudo npm install -g @angular/cli@6
/**
for this do not include the version. This will create angular.json and update package.json
**/
ng update @angular/cli 
ng update @angular/core@6
```

Next update other dependencies:
```
npm install @types/jasmine@latest @types/node@latest codelyzer@latest karma@latest karma-chrome-launcher@latest karma-cli@latest karma-jasmine@latest karma-jasmine-html-reporter@latest jasmine-core@latest jasmine-spec-reporter@latest protractor@latest tslint@latest --save-dev
```
