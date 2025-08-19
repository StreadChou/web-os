# WebOs

## Install

```shell
npm install @stread/web-os -S
```

## Quick Start

``` javascript
import Vue from 'vue'
import WebOSPlugin from '@stread/web-os';
import '@stread/web-os/dist/web-os.css';

app.use(WebOSPlugin, {})
```

```vue

<template>
  <div style="height: 100vh; width: 100vw;">
    <web-os></web-os>
  </div>
</template>

<script setup lang="ts">
  import {AppHelper} from "@stread/web-os";

  AppHelper.registerApp({
    packageId: "com.com.test",
    name: 'AppName',
    icon: 'https://your-icon-image.svg'
  },)
</script>

```


