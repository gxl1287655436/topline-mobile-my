<template>
  <div class="login">
    <van-nav-bar title="登录"></van-nav-bar>
    <form>
      <van-cell-group>
        <van-field
          v-model="user.mobile"
          v-validate="'required'"
          name="mobile"
          :error-message="errors.first('mobile')"
          required
          clearable
          label="手机号"
          right-icon="question-o"
          placeholder="请输入手机号"
        />
        <van-field
          v-model="user.code"
          v-validate="'required'"
          name="code"
          :error-message="errors.first('code')"
          type="password"
          label="密码"
          placeholder="请输入密码"
          required
        />
      </van-cell-group>
    </form>
    <div class="login-btn">
      <van-button
        type="info"
        @click.prevent="handleLogin"
        :loading="loginLoading"
        loading-text="登录中..."
      >登录</van-button>
    </div>
  </div>
</template>

<script>
// 引入 api 中封装的请求
import { login } from "@/api/user";

export default {
  name: "Login",
  data() {
    return {
      user: {
        mobile: "",
        code: ""
      },
      // 加载状态
      loginLoading: false
    };
  },

  created() {
    // 配置验证信息
    this.configCustomMessages();
  },

  methods: {
    // 实现登录功能
    async handleLogin() {
      try {
        // 这个插件的 JavaScript 验证方法设计的不好，并没有在验证失败的时候抛出异常
        const valid = await this.$validator.validate();
        // 如果表单验证失败，则什么都不做
        if (!valid) {
          // 验证失败，代码不会往后执行了，所以在这里也要取消 loading
          this.loginLoading = false;
          return;
        }
        // 只要一发送登陆的请求就更改加载状态
        this.loginLoading = true;
        // 表单验证通过，提交表单
        const data = await login(this.user);
        // console.log(data);
        // 登陆成功后提交 mutation ，更改数据状态，把保存在 state 中的数据改成 data
        this.$store.commit("setUser", data);
        // 跳转到首页
        this.$router.push("/");
      } catch (err) {
        // 请求失败
        console.log(err);
        // 给出失败提示
        this.$toast.fail("登录失败！用户名或密码错误！");
      }
      this.loginLoading = false;
    },

    configCustomMessages() {
      const dict = {
        custom: {
          mobile: {
            required: "手机号不能为空"
          },
          code: {
            required: () => "验证码不能为空"
          }
        }
      };
      this.$validator.localize("zh_CN", dict);
    }
  }
};
</script>

<style lang="less" scoped>
.van-button {
  margin-top: 20px;
  width: 100%;
  border-radius: 10px;
}
</style>
