<template>
  <div class="loadingWrapper">
    <div class="loading"></div>
  </div>
</template>

<script>
export default {
  name: 'spinner'
}
</script>

<style>
.loadingWrapper {
  position: relative;
  width: 100%;
  height: 60px;
  margin-bottom: 20px;
}

.loading,
.loading::before,
.loading::after {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-left-color: rgba(0, 0, 0, 0.4);
  -webkit-border-radius: 999px;
  -moz-border-radius: 999px;
  border-radius: 999px;
}

.loading {
  margin: -9px 0 0 -9px;
  height: 18px;
  width: 18px;
  -webkit-animation: animation-rotate 1000ms linear infinite;
  -moz-animation: animation-rotate 1000ms linear infinite;
  -o-animation: animation-rotate 1000ms linear infinite;
  animation: animation-rotate 1000ms linear infinite;
}

.loading::before {
  content: "";
  margin: -15px 0 0 -15px;
  height: 30px;
  width: 30px;
  -webkit-animation: animation-rotate 1000ms linear infinite;
  -moz-animation: animation-rotate 1000ms linear infinite;
  -o-animation: animation-rotate 1000ms linear infinite;
  animation: animation-rotate 1000ms linear infinite;
}

.loading::after {
  content: "";
  margin: -12px 0 0 -12px;
  height: 24px;
  width: 24px;
  -webkit-animation: animation-rotate 2000ms linear infinite;
  -moz-animation: animation-rotate 2000ms linear infinite;
  -o-animation: animation-rotate 2000ms linear infinite;
  animation: animation-rotate 2000ms linear infinite;
}

@-webkit-keyframes animation-rotate {
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@-moz-keyframes animation-rotate {
  100% {
    -moz-transform: rotate(360deg);
  }
}

@-o-keyframes animation-rotate {
  100% {
    -o-transform: rotate(360deg);
  }
}

@keyframes animation-rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>
