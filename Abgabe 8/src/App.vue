<template>
  <Header />
  <h1>Distanzen:</h1>

  <div v-for="(distance, index) in distances" :key="distance.distance">
    <Distance
      :distanceprop="distance.distance"
      :distanceindex="index"
      @removedistance-index="removeDistance"
    />
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Distance from "./components/Distance.vue";
export default {
  name: "App",
  data() {
    return {
      distances: [
        { distance: "123.07507306808401" },
        { distance: "188.81991836931738" },
        { distance: "149.107765337344" },
        { distance: "1246.5112478650835" },
        { distance: "1698.2397970769064" },
        { distance: "9112.185976741801" },
        { distance: "1600.9111160433256" },
        { distance: "784.8717389958271" },
        { distance: "3113.8365228412313" },
        { distance: "177.95022540387095" },
        { distance: "904.7180188517618" },
      ],
    };
  },
  methods: {
    removeDistance(index) {
      this.distances.splice(index, 1);
    },
  },
  components: {
    Header,
    Distance,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
