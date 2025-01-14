import { defineComponent } from 'vue'
import { youtubeImageUrlToInvidious } from '../../helpers/api/invidious'
import { formatNumber } from '../../helpers/utils'

export default defineComponent({
  name: 'FtListChannel',
  props: {
    data: {
      type: Object,
      required: true
    },
    appearance: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      id: '',
      thumbnail: '',
      channelName: '',
      subscriberCount: 0,
      videoCount: '',
      handle: null,
      uploadedTime: '',
      description: ''
    }
  },
  computed: {
    currentInvidiousInstance: function () {
      return this.$store.getters.getCurrentInvidiousInstance
    },
    listType: function () {
      return this.$store.getters.getListType
    },
    hideChannelSubscriptions: function () {
      return this.$store.getters.getHideChannelSubscriptions
    }
  },
  mounted: function () {
    if (this.data.dataSource === 'local') {
      this.parseLocalData()
    } else {
      this.parseInvidiousData()
    }
  },
  methods: {
    parseLocalData: function () {
      this.thumbnail = this.data.thumbnail

      if (!this.thumbnail.includes('https:')) {
        this.thumbnail = `https:${this.thumbnail}`
      }

      this.channelName = this.data.name
      this.id = this.data.id
      if (this.hideChannelSubscriptions || this.data.subscribers === null) {
        this.subscriberCount = null
      } else {
        this.subscriberCount = this.data.subscribers.replace(/ subscriber(s)?/, '')
      }
      if (this.data.videos === null) {
        this.videoCount = 0
      } else {
        this.videoCount = formatNumber(this.data.videos)
      }

      if (this.data.handle) {
        this.handle = this.data.handle
      }

      this.description = this.data.descriptionShort
    },

    parseInvidiousData: function () {
      // Can be prefixed with `https://` or `//` (protocol relative)
      const thumbnailUrl = this.data.authorThumbnails[2].url

      this.thumbnail = youtubeImageUrlToInvidious(thumbnailUrl, this.currentInvidiousInstance)

      this.channelName = this.data.author
      this.id = this.data.authorId
      if (this.hideChannelSubscriptions) {
        this.subscriberCount = null
      } else {
        this.subscriberCount = formatNumber(this.data.subCount)
      }
      this.videoCount = formatNumber(this.data.videoCount)
      this.description = this.data.description
    }
  }
})
