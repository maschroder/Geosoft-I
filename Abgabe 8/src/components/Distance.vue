<template>
  <div>
    <h2>{{ distances }}</h2>
    <button @click="deleteDistance">Löschen</button>
  </div>
</template>


<script>
export default {
  name: "Distance",
  props: ["distanceprop", "distanceindex"],
  data() {
    return {
      distances: this.distanceprop,
      // lon1 und lat1 sind die Koordinaten aus point.js, lon2 und lat2
      // sind arrays gefüllt mit den Koordinaten aus cities.js
      lon1: [7.595737],
      lat1: [51.969508],
      lon2: [
        [6.957],
        [4.9041],
        [9.4797],
        [2.1686],
        [10.1815],
        [135.7681],
        [26.1025],
        [15.4395],
        [31.2357],
        [6.2603],
        [10.7522],
      ],
      lat2: [
        [50.9367],
        [52.3676],
        [51.3127],
        [41.3874],
        [36.8065],
        [35.0116],
        [44.4268],
        [47.0707],
        [30.0444],
        [53.3498],
        [59.9139],
      ],
    };
  },
  methods: {
    getDistance: function (lon1, lat1, lon2, lat2) {
      const R = 6371; // kilometres
      const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const d = R * c; // in kilometres
      return d;
    },

    deleteDistance: function () {
      this.$emit("removedistance-index", this.distanceindex);
    },
  },
};
</script>
