# NG2 Keepalive

NG2 Keepalive is a keepalive module that allows sessions to be extended across multiple servers (useful for microservices without shared sessions)

## Dependencies
 * @angular/common
 * @angular/core
 * @angular/http

## Installation
```shell
npm install --save ng2-keepalive
```

Once installed you need to import our main module:
```js
import {KeepaliveModule} from 'ng2-keepalive';
```

The only remaining part is to list the imported module in your application module, passing in a config to intialize the logger.

```js
@NgModule({
  declarations: [AppComponent, ...],
  imports: [KeepaliveModule.forRoot({...}), ...],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

## Usage

To use NG2 Keepalive, you will need to add it to your an application html file

```angular2html
<ng2-keepalive></ng2-keepalive>

```


## Config Options
 * activeInterval: {number} - (in seconds) the amount of time since a last action until the user is considered idle : default 15 seconds
 * idleInterval: {number} - (in seconds) the amount of time a user is idle before the user is warned : default 15 minutes
 * warnInterval: {number} - (in seconds) the amount of time a user is warned before the user session is expired : default 60 seconds
 * pingInterval: {number} - (in seconds) how often the server is pinged : default 15 seconds
 * idleOffset {number} - (in seconds) the offset time from your session, so that the client doesn't think the session is good when the server session expires : default 60 seconds
 * pingUrls {string[]} - array of urls to ping ?extend=true will be added if the user has been active : default '/ping'
 * numberOfRetries {number} - number of times failed pings should retry before erroring out
  
 

