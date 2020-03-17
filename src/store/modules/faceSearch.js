/*人脸搜索*/
import axios from "axios";

const state = {
  imageDB: [],
  imageSimilarity: [],
  searchStatus: false
}

const mutations = {
  SET_BD_DATA:(state, data) => {
    state.imageDB = data
  },
  SET_SIMILARY_DATA:(state, data) => {
    state.imageSimilarity = data
    state.searchStatus = true
  },
  SET_STATUS(state, status) {
    state.searchStatus = status
  }
}

const actions = {
  /**
   * 上传分析图片
   * @param commit
   * @param data
   */
  faceSearchSetImageDB({commit}) {
    axios.get('/api/face/imgdb').then(response => {
      let data = response.data
      commit("SET_BD_DATA", data.data)
    }).catch(error => {
      console.log(error)
      alert("获取图片库失败")
    })
  },

  /**
   * 查询相似的图片
   * @param commit
   * @param url
   */
  faceSearchSimilarity({commit, state}, url) {
    commit("SET_STATUS", true)
    axios.post('/api/face/facesearch', {"data": url}).then(response => {
      let data = response.data
      commit("SET_SIMILARY_DATA", data.data)
      commit("SET_STATUS", false)
    }).catch(error => {
      console.log(error)
      alert("获取图片库失败")
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
