<template>
  <MainCard>
    <template v-slot:body>
      <div id="tab" class="nav nav-tabs nav-justified justify-content-center" role="tablist">
        <button aria-controls="nav-map"
                aria-selected="true"
                class="nav-item nav-link active"
                data-bs-target="#nav-map"
                data-bs-toggle="tab"
                href="#map"
                role="tab" type="button"> {{ $t('tabs.map') }}
        </button>
        <button aria-controls="nav-stats"
                aria-selected="true"
                class="nav-item nav-link"
                data-bs-target="#nav-stats"
                data-bs-toggle="tab"
                href="#tab"
                role="tab" type="button"> {{ $t('tabs.stats') }}
        </button>
        <button aria-controls="nav-quests"
                aria-selected="true"
                class="nav-item nav-link"
                data-bs-target="#nav-quests"
                data-bs-toggle="tab"
                href="#tab"
                role="tab" type="button">
          {{ $t('tabs.quests') }}
        </button>
        <button aria-controls="nav-score"
                aria-selected="true"
                class="nav-item nav-link"
                data-bs-target="#nav-score"
                data-bs-toggle="tab"
                href="#tab"
                role="tab" type="button"> {{ $t('tabs.highscore') }}
        </button>
      </div>
      <div id="content" class="tab-content">
        <div id="nav-map"
             aria-labelledby='nav-map-tab'
             class="tab-pane fade show active"
             role="tabpanel"
        >

          <div class="row">
            <div class="row">
              <div class="col">
                <button :class="{'btn-primary':showScans, 'btn-outline-dark':!showScans}" class="btn mb-1"
                        @click="showScans=!showScans">
                  <span v-if="!showScans">{{ $t('message.statsMapShow') }}</span>
                  <span v-else>{{ $t('message.statsMapHide') }}</span>
                  <br>{{ $t('message.statsMapAllScans') }}
                </button>
              </div>
              <div class="col">
                <button :class="{'btn-primary':showTeams, 'btn-outline-dark':!showTeams}" class="btn mb-1"
                        @click="showAllTeams">
                  <span v-if="!showTeams">{{ $t('message.statsMapShow') }}</span>
                  <span v-else>{{ $t('message.statsMapHide') }}</span>
                  <br>{{ $t('message.statsMapAllTeams') }}
                </button>
              </div>
              <div v-for="t in teams" :key="t" class="col">
                <button
                  :class="{'btn-primary':(showTeam.includes(t._key)), 'btn-outline-dark':!(showTeam.includes(t._key))}"
                  class="btn mb-1"
                  @click="showTeamAction(t)">
                  <span v-if="!(showTeam.includes(t._key))">{{ $t('message.statsMapShow') }}</span>
                  <span v-else>{{ $t('message.statsMapHide') }}</span>
                  <br>{{ t.name }}
                </button>
              </div>

            </div>
            <ol-map
              :loadTilesWhileAnimating="true"
              :loadTilesWhileInteracting="true"
              :moveTolerance="50" style="height: 600px"
            >

              <ol-view
                ref="view"
                :center="[8.692012062655706, 49.88506339292571 ]"
                :rotation="0"
                :zoom="14"
                projection="EPSG:4326"
              />

              <ol-tile-layer>
                <ol-source-osm/>
              </ol-tile-layer>
              <ol-interaction-clusterselect :pointRadius="20" @select="featureSelected">
                <ol-style>
                  <ol-style-stroke :width="5" color="green"></ol-style-stroke>
                  <ol-style-fill color="rgba(255,255,255,0.5)"></ol-style-fill>
                  <ol-style-icon :scale="0.05" :src="markerIcon"></ol-style-icon>
                </ol-style>
              </ol-interaction-clusterselect>
              <ol-animated-clusterlayer :animationDuration="500" :distance="40">
                <ol-source-vector ref="vectorsource">
                  <ol-feature v-for="(s, i) in stats.filter(s => 'type' in s && s.type === 'spotScan')"
                              :key="i">
                    <ol-geom-point v-if="showScans && getSpot(s.spot)"
                                   :coordinates="getCoordinates(getSpot(s.spot).WKT)"
                    ></ol-geom-point>
                  </ol-feature>
                  <ol-feature v-for="(s, i) in stats.filter(s => 'type' in s && s.type === 'startQuest')"

                              :key="i">
                    <ol-geom-point
                      v-if="(showTeams || showTeam.includes(s.team)) && spots.find((spot) => spot._key === s.spot)"
                      :coordinates="getCoordinates(spots.find((spot) => spot._key === s.spot).WKT)"
                    ></ol-geom-point>
                  </ol-feature>
                </ol-source-vector>

                <ol-style :overrideStyleFunction="overrideStyleFunction">
                  <ol-style-stroke :width="2" color="red"></ol-style-stroke>
                  <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>

                  <ol-style-circle :radius="20">
                    <ol-style-stroke
                      :lineDash="[]"
                      :width="15"
                      color="black"
                      lineCap="butt"
                    ></ol-style-stroke>
                    <ol-style-fill color="black"></ol-style-fill>
                  </ol-style-circle>

                  <ol-style-text>
                    <ol-style-fill color="white"></ol-style-fill>
                  </ol-style-text>
                </ol-style>
              </ol-animated-clusterlayer>
            </ol-map>
          </div>
        </div>
        <div id="nav-stats"
             aria-labelledby="nav-map-stats"
             class="tab-pane fade"
             role="tabpanel"
        >
          <div class="row">
            <div class="col">
              <h2 class="pt-2">Statistics</h2>
              <table class="table table-striped table-hover">
                <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col"></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Number of players</td>
                  <td>{{ player.length }}</td>
                </tr>
                <tr>
                  <td>Number of teams</td>
                  <td>{{ teams.length }}</td>
                </tr>
                <tr>
                  <td>Number of tasks</td>
                  <td>{{ settings.num_tasks }}</td>
                </tr>
                <tr>
                  <td>Number of questions</td>
                  <td>{{ quests.length }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div id="nav-quests"
             aria-labelledby="nav-quests"
             class="tab-pane fade"
             role="tabpanel"
        >
          <h3 class="pt-2">
            {{ $t('message.incorrectAnswersTitle') }}
          </h3>
          <table class="table table-striped table-hover">
            <thead>
            <tr>
              <th scope="col">{{ $t('table.time') }}</th>
              <th scope="col">{{ $t('table.question') }}</th>
              <th scope="col">{{ $t('table.answer') }}</th>
              <th scope="col">{{ $t('table.team') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr
              v-for="s in stats.filter(s => 'type' in s && (s.type === 'quest_error')).sort((a, b) => { return new Date(b.time) - new Date(a.time)})"
              :key="s._key">

              <td> {{ (new Date(s.time).toLocaleString()) }}</td>
              <td v-if="'question' in s">
                {{ s.question }}
              </td>
              <td v-else></td>
              <td>{{ s.answer }}</td>
              <td v-if="'teamName' in s"> {{ s.teamName }}</td>
              <td v-else></td>

            </tr>
            </tbody>
          </table>
        </div>
        <div id="nav-score"
             aria-labelledby="nav-score-tab"
             class="tab-pane fade"
             role="tabpanel"
        >
          <h3 class="pt-2">
            {{ $t('message.highScoreTitle') }}
          </h3>
          <div class="d-flex flex-grow-1 align-middle justify-content-center">
            <HighScores></HighScores>
          </div>
        </div>
      </div>

    </template>
  </MainCard>

</template>

<script>
import MainCard from "../../components/Card.vue";
import HighScores from "../../components/HighScores.vue";
import markerIcon from "../../assets/geo-fill.png";
import {sha256} from "js-sha256";

export default {
  name: "StatsRoute",
  components: {MainCard, HighScores},
  inject: ['settings', 'player', 'teams', 'stats', 'spots', 'quests'],
  data() {
    return {
      markerIcon,
      showScans: false,
      showTeams: true,
      showTeam: [],
    };
  },
  unmounted() {
    this.$socket.emit('aboStats', false);
  },
  mounted() {
    this.$socket.emit('aboStats', true);
  },
  methods: {
    getSpot(hash) {
      return this.spots.find((spot) => this.getSpotId(spot) === hash);
    },
    getSpotId(spot) {
      return sha256(spot.Name + this.settings.seed).slice(-10);
    },
    getCoordinates(pointText) {
      const c1 = pointText.match(/([0-9]*[.])?[0-9]+/g);
      return [parseFloat(c1[0]), parseFloat(c1[1])];
    },
    overrideStyleFunction(feature, style) {
      const clusteredFeatures = feature.get("features");
      const size = clusteredFeatures.length;

      const color = size > 20 ? "192,0,0" : size > 8 ? "255,128,0" : "0,128,0";
      const radius = Math.max(8, Math.min(size, 20));
      const dash = (2 * Math.PI * radius) / 6;
      const calculatedDash = [0, dash, dash, dash, dash, dash, dash];

      style.getImage().getStroke().setLineDash(dash);
      style
        .getImage()
        .getStroke()
        .setColor("rgba(" + color + ",0.5)");
      style.getImage().getStroke().setLineDash(calculatedDash);
      style
        .getImage()
        .getFill()
        .setColor("rgba(" + color + ",1)");

      style.getImage().setRadius(radius);

      style.getText().setText(size.toString());
    },
    getRandomInRange(from, to, fixed) {
      return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
    }, featureSelected(event) {
      console.log(event);
    },
    showTeamAction(team) {
      this.showTeams = false
      if (this.showTeam.includes(team._key)) {
        this.showTeam.splice(this.showTeam.indexOf(team._key), 1);
      } else {
        this.showTeam.push(team._key);
      }
    },
    showAllTeams() {
      this.showTeam = [];
      if (this.showTeams) {
        this.showTeams = false;
      } else {
        this.showTeams = true;
        this.teams.map(t => (this.showTeam.push(t._key)));
      }
    },
  },

}
</script>

<style scoped>

</style>