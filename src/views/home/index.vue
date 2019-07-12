<template>
  <div class="home">
    <van-nav-bar title="首页" fixed />
    <!-- 顶部导航栏 -->
    <van-tabs class="channel-tabs" v-model="activeChannelIndex">
      <van-tab v-for="channelItem in channels" :key="channelItem.id" :title="channelItem.name"></van-tab>
    </van-tabs>
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 内容列表 -->
      <div class="list">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-cell v-for="item in list" :key="item" :title="item" />
        </van-list>
      </div>
    </van-pull-refresh>

    <!-- 底部导航栏 -->
    <div class="bottom">
      <van-tabbar v-model="activeChannelIndex">
        <van-tabbar-item name="home" icon="home-o">首页</van-tabbar-item>
        <van-tabbar-item name="search" icon="search">问答</van-tabbar-item>
        <van-tabbar-item name="friends" icon="friends-o">视频</van-tabbar-item>
        <van-tabbar-item name="setting" icon="setting-o">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
// 引入获取频道列表的api
import { getUserChannels } from "@/api/channel";
import { getArticles } from "@/api/article";

export default {
  name: "Home",
  data() {
    return {
      // 频道激活的样式
      activeChannelIndex: 0,
      // 标签栏的选中样式
      active: "home",
      list: [],
      finished: false,
      loading: false,
      count: 0,
      isLoading: false,
      channels: [] // 频道列表
    };
  },

  computed: {
    /**
     * 当前激活的频道
     */
    activeChannel() {
      return this.channels[this.activeChannelIndex];
    }
  },

  async created() {
    // 获取频道列表
   await this.loadChannels();
  },

  methods: {
    // 获取频道列表
    async loadChannels() {
      // 已登录
      // 判断 store 中是否有用户信息
      const { user } = this.$store.state;
      let channels = [];
      // 如果有用户信息，说明已经登录了
      if (user) {
        // 现在请求的频道列表是登录之后的
        const data = await getUserChannels();
        // console.log(data);
        channels = data.channels;
      } else {
        // 未登录
        //  判断本地存储中是否有数据
        const localChannels = JSON.parse(
          window.localStorage.getItem("channels")
        );

        if (localChannels) {
          // 有数据，直接显示
          channels = localChannels;
        } else {
          // 没有数据，发送请求
          const data = await getUserChannels();
          channels = data.channels;
        }
      }

      // 在获取到频道列表之后，修改 channels 的数据格式
      // 添加我们需要的数据
      // 修改 channels，将这个数据结构修改为满足我们使用的需求
      channels.forEach(item => {
        item.articles = []; // 用来存储当前文章的列表
        item.timestamp = Date.now(); // 存储下一页数据的时间戳
        item.downPullLoading = false; // 控制当前频道的下拉刷新 loading 状态
        item.upPullLoading = false; // 控制当前频道的上拉加载更多的 loading 状态
        item.upPullFinished = false; // 控制当前频道数据是否加载完毕
      });

      this.channels = channels;

      console.log('loadChannels end...')

      // console.log(this.activeChannel);
    },

    // 上拉加载更多，有新数据就 push 到列表上
    async onLoad() {
      console.log('onLoad start...')
      let data = [];
      data = await this.loadArticles();
      console.log(data);
      // pre_timestamp 下一页的页码
      // results 文章列表
      // console.log(data)

      // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1);
      //   }
      //   // 加载状态结束
      //   this.loading = false;

      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true;
      //   }
      // }, 500);
    },

    // 下拉刷新
    async onRefresh() {
      // const { activeChannel } = this;
      // // 备份加载下一页数据的时间戳
      // const timestamp = activeChannel.timestamp;
      // // 使用最新数据时间戳取请求文章列表
      // activeChannel.timestamp = Date.now();
      // const data = await this.loadArticles();

      // // 判断当前最新时间是否有新数据
      //  // 如果有最新数据，将数据更新到频道的文章列表中
      // if (data.results.length) {
      //   // 将最新内容重置到内容列表中
      //   activeChannel.articles = data.results;

      //   //  由于你重置了文章列表，那么当前数据中的 pre_timestamp 就是上拉加载更多的下一页数据的时间戳
      //   activeChannel.timestamp = data.pre_timestamp;
      //   activeChannel.downPullSuccessText = "更新成功";

      //   // / 当下拉刷新有数据并重置以后数据无法满足一屏，所以我们使用 onLoad 再多加载一页数据
      //   this.onLoad();
      // } else {
      //   // 如果没有最新数据，提示已是最新内容
      //   activeChannel.downPullSuccessText = "已是最新数据";
      // }

      // // 下拉刷新结束，取消 loading 状态
      // activeChannel.downPullLoading = false
      
      // // 没有最新数据，将原来的用于请求下一页的时间戳恢复过来
      // activeChannel.timestamp = timestamp

    },

    // 封装获取当前频道下的推荐文章
    async loadArticles() {
      // console.log(this.activeChannel)
      const { id: channelId, timestamp } = this.activeChannel;
      const data = await getArticles({
        channelId, // 当前激活频道id
        timestamp, // 当前频道下一页数据的时间戳
        withTop: 1 // 是否包含置顶数据
      });
      return data;
    }
  }
};
</script>

<style lang="less" scoped>
.bottom {
  margin-top: 100px;
}
.channel-tabs {
  margin-bottom: 100px;
}
// 深度作用选择器：https://vue-loader.vuejs.org/zh/guide/scoped-css.html#%E6%B7%B1%E5%BA%A6%E4%BD%9C%E7%94%A8%E9%80%89%E6%8B%A9%E5%99%A8
.channel-tabs /deep/ .van-tabs__wrap {
  position: fixed;
  top: 92px;
}
.channel-tabs /deep/ .van-tabs__content {
  margin-top: 100px;
}
</style>