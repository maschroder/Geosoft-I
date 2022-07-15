<template>
  <div>
    <img alt="ifgi logo" src="../assets/ifgi-logo-2021.png" />
    <Distance />
    <div class="info">
      Geosoftware I SoSe 2022, Abgabe 8 <br />
      Distanzen zu Städten mit unserer Vue.js App
    </div>
    <br />
  </div>
</template>


<!-- Modul exportieren, damit dieses in App.vue verwendet werden kann. -->
<script>
export default {
  name: "Header",
};
</script>

<!-- Mit "scoped" wird der Style nur für die Komponente angewendet -->
<style scoped>
.info {
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 14px;
}
</style>