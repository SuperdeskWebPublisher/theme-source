<template>
  <div class="darkTabs">
    <ul class="darkTabs__nav">
      <li v-bind:class="{ 'active' : activeTab=='sections' }" @click="activeTab='sections'">Sections</li>
      <li v-bind:class="{ 'active' : activeTab=='sources' }" @click="activeTab='sources'">Sources</li>
    </ul>
    <div v-if="activeTab=='sections'">
      <table class="sectionsTable">
        <tr v-for="item in localSections">
          <td class="sectionsTable__slider">
            <slider ref="slider" v-model="item.score" :value="item.score" :min="0" :max="10" :interval="5" :piecewise="true" tooltip="none" :real-time="true" :height="2" :dot-size="12"></slider>
          </td>
          <td class="sectionsTable__title">
            {{item.title}}
          </td>
        </tr>
      </table>
      <div class="darkTabs__buttons">
        <button v-on:click="save()" class="button button--small" v-bind:disabled="busy">Save</button>
        <button v-on:click="$emit('close')" class="button button--grey button--small">Cancel</button>
      </div>
    </div>
    <div v-if="activeTab=='sources'">
      <table class="sectionsTable">
        <tr v-for="item in localSources">
          <td class="sectionsTable__slider">
            <slider ref="slider" v-model="item.switch" :value="item.switch" :min="0" :max="1" tooltip="none" :real-time="true" :height="2" :dot-size="12"></slider>
          </td>
          <td class="sectionsTable__title">
            {{item.title}}
          </td>
        </tr>
      </table>
      <div class="darkTabs__buttons">
        <button v-on:click="save()" class="button button--small" v-bind:disabled="busy">Save</button>
        <button v-on:click="$emit('close')" class="button button--grey button--small">Cancel</button>
      </div>
    </div>
  </div>
  
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import slider from '@/components/slider.vue'

export default {
  name: 'personalize',
  components: {
    slider
  },
  data: function () {
    return {
      busy: false,
      activeTab: 'sections'
    }
  },
  computed: {
    ...mapGetters({
      sections: 'getFrontpageSections',
      sources: 'getSources'
    }),
    localSections: function () {
      return JSON.parse(JSON.stringify(this.sections))
    },
    localSources: function () {
      return JSON.parse(JSON.stringify(this.sources))
    }
  },
  methods: {
    ...mapActions(['saveFilters']),
    save: function () {
      this.saveFilters({
        sections: this.localSections,
        sources: this.localSources
      })
      this.$emit('close')
    }
  }
}
</script>
