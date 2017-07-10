# Start a Project

This builds on top of the SKY UX [Getting Started guide](http://skyux.developer.blackbaud.com/getting-started/start-a-project/).

This walkthrough guides you through the process to create a basic application with SKY UX and bbui-angular. We’ll start with a blank HTML page and proceed to a fully functioning application.

## Create a page

Let's start with a basic HTML page that includes SKY UX. Because we will be making http requests to Blackbaud CRM, it's easiest if you set up your page inside of your CRM virtual directory. Let's make it at [http://localhost/bbappfx/sky/custom/myapp](http://localhost/bbappfx/sky/custom/myapp). This way, you can avoid CORS and web.config issues while doing development.

Your environment may have a different virtual directory name than `bbappfx`. That's fine, just replace anywhere you see `bbappfx` with the name of your virtual directory. Replace `localhost` with the name of the machine you are accessing, if CRM is not deployed locally.

First, create a folder and then add an HTML file called `index.html`. To ensure that the page renders properly in all modern browsers, start with the following boilerplate HTML:

<pre><code>&lt;!DOCTYPE html>
&lt;html charset="utf-8">
  &lt;head>
    &lt;meta http-equiv="X-UA-Compatible" content="IE=edge">
    &lt;title>My First bbui-angular App&lt;/title>
  &lt;/head>
  &lt;body>

  &lt;/body>
&lt;/html></code></pre>

Next, to add SKY UX to the page, point to SKY UX via the Blackbaud SKY CDN.

<div class="bb-note">
If you wish to host SKY UX yourself, you may install it via <a href="http://bower.io/">Bower</a> or <a href="https://www.npmjs.com/package/blackbaud-skyux">NPM</a> instead of pointing to the CDN. See the <a href="https://github.com/blackbaud/skyux/">SKY UX GitHub page</a> for instructions on installing via Bower.
</div>

<pre><code>&lt;!DOCTYPE html>
&lt;html charset="utf-8">
  &lt;head>
    &lt;meta http-equiv="X-UA-Compatible" content="IE=edge">
    &lt;title>My First bbui-angular App&lt;/title>
    &lt;link rel="stylesheet" href="https://sky.blackbaudcdn.net/skyux/1.6.6/css/sky-bundle.css" integrity="sha384-0qQTcXi3TFJvyqm3IBveZiYW0GHbY8LuphtukDr6FkZdy6FEXIHdQ6yF6Z3GUbvK" crossorigin="anonymous">
  &lt;/head>
  &lt;body>
    &lt;script src="https://sky.blackbaudcdn.net/skyux/1.6.6/js/sky-bundle.min.js" integrity="sha384-DD+Y69jYPzp2eVhGSZyfXyW+TxZpImxAF4T16WyV4YVpycGhkUVzOiCE0jKscve/" crossorigin="anonymous">&lt;/script>
  &lt;/body>
&lt;/html></code></pre>

Next, add bbui-angular to the page.

<pre><code>&lt;!DOCTYPE html>
&lt;html charset="utf-8">
  &lt;head>
    &lt;meta http-equiv="X-UA-Compatible" content="IE=edge">
    &lt;title>My First bbui-angular App&lt;/title>
    &lt;link rel="stylesheet" href="https://sky.blackbaudcdn.net/skyux/1.6.6/css/sky-bundle.css" integrity="sha384-0qQTcXi3TFJvyqm3IBveZiYW0GHbY8LuphtukDr6FkZdy6FEXIHdQ6yF6Z3GUbvK" crossorigin="anonymous">
  &lt;/head>
  &lt;body>
    &lt;script src="https://sky.blackbaudcdn.net/skyux/1.6.6/js/sky-bundle.min.js" integrity="sha384-DD+Y69jYPzp2eVhGSZyfXyW+TxZpImxAF4T16WyV4YVpycGhkUVzOiCE0jKscve/" crossorigin="anonymous">&lt;/script>
    &lt;script src="bower_components/bbui-angular/dist/js/bbui.js">&lt;/script>
  &lt;/body>
&lt;/html></code></pre>

## Web.config

You need to create a web.config to turn anonymous authentication on for this page. If you don't allow anonymous authentication, users will be prompted to log in before they get to your page, and, with some authentication set ups, will have to log in a second time.

<pre><code>
&lt;configuration>
	&lt;location path="index.html">
		&lt;system.webServer>
			&lt;security>
				&lt;authentication>
					&lt;basicAuthentication enabled="false" />
					&lt;anonymousAuthentication enabled="true" />
					&lt;windowsAuthentication enabled="false" />
				&lt;/authentication>
			&lt;/security>
		&lt;/system.webServer>
	&lt;/location>
	&lt;location path="js/index.js">
		&lt;system.webServer>
			&lt;security>
				&lt;authentication>
					&lt;basicAuthentication enabled="false" />
					&lt;anonymousAuthentication enabled="true" />
					&lt;windowsAuthentication enabled="false" />
				&lt;/authentication>
			&lt;/security>
		&lt;/system.webServer>
	&lt;/location>
    &lt;location path="bower_components/bbui-angular/dist/js/bbui.js">
		&lt;system.webServer>
			&lt;security>
				&lt;authentication>
					&lt;basicAuthentication enabled="false" />
					&lt;anonymousAuthentication enabled="true" />
					&lt;windowsAuthentication enabled="false" />
				&lt;/authentication>
			&lt;/security>
		&lt;/system.webServer>
	&lt;/location>
&lt;/configuration>
</code></pre>

You should now be able to browse to your page in a web browser. Check the browser's console to make sure you don't have any errors.

## Add content to the page

### Simple HTML elements

<p>Let's brighten things up a bit by adding a button to the page. SKY UX is based on Bootstrap, so we can use all <a href="http://getbootstrap.com/css/" target="blank">standard Bootstrap CSS classes</a>.</p>

<p>Add a <code>div</code> tag within your page's <code>&#60;body&#62;</code> element and use the <code>class</code> attribute to wrap the button in the Bootstrap CSS class <code>.container-fluid</code> and the SKY UX CSS class <code>.bb-page-content</code>. These classes separate the content from the navbar and the edges of the browser window.</p>

<p class="alert alert-info">For brevity, the remaining code samples omit the boilerplate HTML and just show the code to add to your page's <code>&#60;body&#62;</code> element.</p>

<pre><code class="language-markup">&lt;div class="container-fluid bb-page-content">
  &lt;button type="button" class="btn btn-primary">Hello World&lt;/button>
&lt;/div>
</code></pre>

<p>While the button respects the Bootstrap <code>btn-primary</code> class, it looks a little different than the default Bootstrap button.  SKY UX overrides Bootstrap styles with its own styles to create a unique user interface that still takes advantage of the responsive nature of its Bootstrap core.</p>

<h3>AngularJS directives</h3>

<p>Of course, SKY UX is more than just CSS. It also features an <a href="http://skyux.developer.blackbaud.com/components/">extensive library</a> of <a href="https://angularjs.org/" target="blank">AngularJS</a> components. To use these, your page must define an Angular application.</p>

<p>In the page's <code>html</code> element, add an <code>ng-app</code> attribute, but don't refresh your browser just yet.</p>

<pre><code class="language-markup">&lt;html charset="utf-8" ng-app="skytutorial"&gt;</code></pre>

<p>To define <code>skytutorial</code> as an Angular module in JavaScript so that Angular knows what to wire up to your HTML page, create an <code>index.js</code> file in a `js` folder next to <code>index.html</code> at the root of your project. Add a reference to your <code>index.js</code> to the bottom of the <code>&#60;body&#62;</code> element.</p>

<pre><code class="language-markup">&lt;script src="js/index.js"&gt;&lt;/script&gt;</code></pre>

<p>In the <code>index.js</code> file, add the <code>sky</code> and `bbui` modules as dependencies on your <code>skytutorial</code> module by putting them in brackets as the second argument to <code>angular.module()</code>. This ensures that all SKY UX and bbui-angular functionality is available to your Angular application.</p>

<pre><code class="language-javascript">(function () {
  'use strict';

  angular.module('skytutorial', ['sky', 'bbui']);
}());</code></pre>

<p>Now that our page is a proper Angular application, we can add Angular components. Let's start with the navbar. Don't worry too much about what all this HTML does for now. I just copied it from the <a href="http://skyux.developer.blackbaud.com/components/navbar/">navbar documentation</a> and pasted it here as-is. Copy the following HTML and paste it immediately after your opening <code>&#60;body&#62;</code> tag.</p>

<pre><code class="language-markup">&lt;bb-navbar>
  &lt;div class="container-fluid">
    &lt;ul class="nav navbar-nav navbar-left">
      &lt;li class="bb-navbar-active">&lt;a href="">Selected Item&lt;/a>&lt;/li>
      &lt;li class="dropdown">
        &lt;a href="" class="dropdown-toggle" role="button">Child Items &lt;span class="caret">&lt;/span>&lt;/a>
        &lt;ul class="dropdown-menu" role="menu">
          &lt;li>
            &lt;a href="">Child Item 1&lt;/a>
          &lt;/li>
          &lt;li>
            &lt;a href="">Child Item 2&lt;/a>
          &lt;/li>
          &lt;li>
            &lt;a href="">Child Item 3&lt;/a>
          &lt;/li>
        &lt;/ul>
      &lt;/li>
    &lt;/ul>
    &lt;ul class="nav navbar-nav navbar-right">
      &lt;li>&lt;a href="">Right Item&lt;/a>&lt;/li>
    &lt;/ul>
  &lt;/div>
&lt;/bb-navbar>
</code></pre>

<p>At this point, your HTML file should look like this:</p>

<pre><code class="language-markup">&lt;!DOCTYPE html>
&lt;html charset="utf-8" ng-app="skytutorial">
&lt;head>
  &lt;meta http-equiv="X-UA-Compatible" content="IE=edge">
  &lt;title>My First SKY UX App&lt;/title>
  &lt;link rel="stylesheet" href="https://sky.blackbaudcdn.net/skyux/1.6.6/css/sky-bundle.css" integrity="sha384-0qQTcXi3TFJvyqm3IBveZiYW0GHbY8LuphtukDr6FkZdy6FEXIHdQ6yF6Z3GUbvK" crossorigin="anonymous">
&lt;/head>
&lt;body>
  &lt;bb-navbar>
    &lt;div class="container-fluid">
      &lt;ul class="nav navbar-nav navbar-left">
        &lt;li class="bb-navbar-active">&lt;a href="">Selected Item&lt;/a>&lt;/li>
        &lt;li class="dropdown">
          &lt;a href="" class="dropdown-toggle" role="button">Child Items &lt;span class="caret">&lt;/span>&lt;/a>
          &lt;ul class="dropdown-menu" role="menu">
            &lt;li>
              &lt;a href="">Child Item 1&lt;/a>
            &lt;/li>
            &lt;li>
              &lt;a href="">Child Item 2&lt;/a>
            &lt;/li>
            &lt;li>
              &lt;a href="">Child Item 3&lt;/a>
            &lt;/li>
          &lt;/ul>
        &lt;/li>
      &lt;/ul>
      &lt;ul class="nav navbar-nav navbar-right">
        &lt;li>&lt;a href="">Right Item&lt;/a>&lt;/li>
      &lt;/ul>
    &lt;/div>
  &lt;/bb-navbar>
  &lt;div class="container-fluid bb-page-content">
    &lt;button type="button" class="btn btn-primary">Hello World&lt;/button>
  &lt;/div>
  &lt;script src="https://sky.blackbaudcdn.net/skyux/1.6.6/js/sky-bundle.min.js" integrity="sha384-DD+Y69jYPzp2eVhGSZyfXyW+TxZpImxAF4T16WyV4YVpycGhkUVzOiCE0jKscve/" crossorigin="anonymous">&lt;/script>
  &lt;script src="bower_components/bbui-angular/dist/js/bbui.js">&lt;/script>
  &lt;script src="js/index.js">&lt;/script>
&lt;/body>

&lt;/html></code></pre>

<p>And there you have it! A page that uses both the CSS and Angular components of SKY UX.</p>

<hr>

<p><strong>Next step:</strong> <a href="#!/guide/authentication">Authentication »</a></p>
