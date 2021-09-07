import TypeModal from '../components/TypeModal.vue'

export default {
  data () {
    return {
      region: {
        北部: ['台北', '新北', '桃園', '新竹'],
        中部: ['苗栗', '台中', '南投', '雲林'],
        南部: ['嘉義', '台南', '高雄', '屏東'],
        東部: ['宜蘭', '花蓮', '台東'],
        離島: ['金門', '澎湖']
      },
      cities: ['台北', '新北', '桃園', '新竹'],
      features: [
        '免裝備',
        '裝備租借',
        '雨棚',
        '遊戲設施',
        '玩水',
        '高海拔',
        '森林',
        '草原',
        '靠海',
        '夜景',
        '雲海'
      ],
      temType: {},
      types: [],
      temTypes: [],
      isNew: false,
      itemRefs: []
    }
  },
  watch: {
    temProduct: {
      handler () {
        const typeGroup = this.types
        if (typeGroup && typeGroup.length) {
          const typePriceArr = typeGroup.map(type => type.price)
          this.temProduct.origin_price = Math.min(...typePriceArr)
          this.temProduct.price = Math.max(...typePriceArr)
        }
      },
      deep: true
    }
  },
  inject: ['emitter'],
  components: {
    TypeModal
  },
  beforeUpdate () {
    this.itemRefs = []
  },
  methods: {
    updateCities () {
      this.cities = this.region[this.temProduct.region]
      this.temProduct.city = this.cities[0]
    },
    setItemRef (el) {
      if (el) {
        this.itemRefs.push(el)
      }
    },
    uploadFile () {
      const file = this.$refs.fileInput.files[0]
      const formData = new FormData()
      formData.append('file-to-upload', file)
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/upload`
      this.$http.post(api, formData).then(response => {
        if (response.data.success) {
          this.temProduct.imageUrl = response.data.imageUrl
        }
      })
    },
    uploadFileMore (key) {
      const file = this.itemRefs[key].files[0]
      console.log(file)
      const formData = new FormData()
      formData.append('file-to-upload', file)
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/upload`
      this.$http.post(api, formData).then(response => {
        if (response.data.success) {
          this.temProduct.images[key] = response.data.imageUrl
        }
      })
    },
    openModal (isNew, type) {
      if (isNew) {
        this.temType = {}
      } else {
        this.temType = type
      }
      this.isNew = isNew
      this.$refs.typeModal.showModal()
    },
    getTypes () {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/products`
      this.isLoading = true
      this.$http.get(api).then(res => {
        this.isLoading = false
        if (res.data.success) {
          this.types = res.data.products.filter(
            product => product.belong_to === this.temProduct.title
          )
        }
      })
    },
    updateTemType (item) {
      if (this.isNew) {
        this.temTypes.push(item)
      } else {
        const i = this.temTypes.indexOf(item)
        this.temTypes[i] = this.temType
      }
      this.$refs.typeModal.hideModal()
    },
    deleteTemType (item) {
      const i = this.temTypes.indexOf(item)
      this.temTypes.splice(i, 1)
    },
    cancel () {
      this.$router.push('/admin/products')
    }
  }
}