<script>
  import { onMount } from 'svelte'
  import Layout from './layout.svelte'

  let formModel = {
    name: '',
    appid: '',
    agentid: '',
    response_type: '',
    scope: '',
    type: '',
    redirect_uri: '',
    secret: ''
  }

  export let app

  async function onSubmit() {
    if (app && app.id) {
      onUpdate()
    } else {
      onCreate()
    }
  }

  async function onCreate() {
    fetch('/config/app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formModel)
    }).then(({ ok }) => {
      if (ok) {
        alert('创建成功')
        location.href = '/login'
      }
    })
  }

  async function onUpdate() {
    fetch(`/config/app/${app.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formModel)
    }).then(({ ok }) => {
      if (ok) {
        alert('更新成功')
        location.href = '/login'
      }
    })
  }

  onMount(() => {
    if (app) {
      formModel = {
        ...app
      }
    }
  })
</script>

<svelte:head>
  <title>登录授权</title>
</svelte:head>

<Layout path="login">
  <div
    class="header p-5 flex flex-row space-x-5 justify-between"
  >
    <div class="title text-2xl">创建应用</div>
    <div class="action">
      <a href="#">
        <button
          on:click={onSubmit}
          class="btn btn-sm btn-info">提交</button
        ></a
      >
      <a href="/login">
        <button class="btn btn-sm btn-info">返回</button></a
      >
    </div>
  </div>

  <div class="form-container px-10 py-3">
    <div class="form-control">
      <label class="label" for="name">
        <span class="label-text">应用名称</span>
      </label>
      <input
        bind:value={formModel.name}
        type="text"
        placeholder=""
        class="input input-bordered"
      />
    </div>

    <div class="form-control">
      <label class="label" for="type">
        <span class="label-text">应用类型</span>
      </label>
      <input
        bind:value={formModel.type}
        type="text"
        placeholder=""
        class="input input-bordered"
      />
    </div>

    <div class="form-control">
      <label class="label" for="appid">
        <span class="label-text">appid</span>
      </label>
      <input
        bind:value={formModel.appid}
        type="text"
        placeholder=""
        class="input input-bordered"
      />
    </div>

    <div class="form-control">
      <label class="label" for="agentid">
        <span class="label-text">agentid</span>
      </label>
      <input
        bind:value={formModel.agentid}
        type="text"
        placeholder=""
        class="input input-bordered"
      />
    </div>

    <div class="form-control">
      <label class="label" for="response_type">
        <span class="label-text">response_type</span>
      </label>
      <input
        bind:value={formModel.response_type}
        type="text"
        placeholder=""
        class="input input-bordered"
      />
    </div>

    <div class="form-control">
      <label class="label" for="scope">
        <span class="label-text">scope</span>
      </label>
      <input
        bind:value={formModel.scope}
        type="text"
        placeholder=""
        class="input input-bordered"
      />
    </div>

    <div class="form-control">
      <label class="label" for="redirect_uri">
        <span class="label-text">redirect_uri</span>
      </label>
      <input
        bind:value={formModel.redirect_uri}
        type="text"
        placeholder=""
        class="input input-bordered"
      />
    </div>

    <div class="form-control">
      <label class="label" for="secret">
        <span class="label-text">secret</span>
      </label>
      <input
        bind:value={formModel.secret}
        type="text"
        placeholder=""
        class="input input-bordered"
      />
    </div>
  </div>
</Layout>
