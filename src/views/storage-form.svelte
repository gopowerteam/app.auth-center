<script>
  import { onMount } from 'svelte'
  import Layout from './layout.svelte'

  let formModel = {
    name: '',
    type: '',
    secretId: '',
    secretKey: '',
    action: '',
    bucket: '',
    region: '',
    prefix: ''
  }

  export let storage

  async function onSubmit() {
    if (storage && storage.id) {
      onUpdate()
    } else {
      onCreate()
    }
  }

  async function onCreate() {
    fetch('/config/storage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formModel)
    }).then(({ ok }) => {
      if (ok) {
        alert('创建成功')
        location.href = '/storage'
      }
    })
  }

  async function onUpdate() {
    fetch(`/config/storage/${storage.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formModel)
    }).then(({ ok }) => {
      if (ok) {
        alert('更新成功')
        location.href = '/storage'
      }
    })
  }

  onMount(() => {
    if (storage) {
      formModel = {
        ...storage
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
      <a href="/storage">
        <button class="btn btn-sm btn-info">返回</button></a
      >
    </div>
  </div>

  <div class="form-container px-10 py-3">
    <div class="form-control">
      <label class="label" for="name">
        <span class="label-text">存储名称</span>
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
        <span class="label-text">存储类型</span>
      </label>
      <input
        bind:value={formModel.type}
        type="text"
        placeholder=""
        class="input input-bordered"
      />
    </div>

    <div class="form-control">
      <label class="label" for="secretId">
        <span class="label-text">secretId</span>
      </label>
      <input
        bind:value={formModel.secretId}
        type="text"
        placeholder=""
        class="input input-bordered"
      />
    </div>

    <div class="form-control">
      <label class="label" for="secretKey">
        <span class="label-text">secretKey</span>
      </label>
      <input
        bind:value={formModel.secretKey}
        type="text"
        placeholder=""
        class="input input-bordered"
      />
    </div>

    <div class="form-control">
      <label class="label" for="action">
        <span class="label-text">action</span>
      </label>
      <input
        bind:value={formModel.action}
        type="text"
        placeholder=""
        class="input input-bordered"
      />
    </div>

    <div class="form-control">
      <label class="label" for="bucket">
        <span class="label-text">bucket</span>
      </label>
      <input
        bind:value={formModel.bucket}
        type="text"
        placeholder=""
        class="input input-bordered"
      />
    </div>

    <div class="form-control">
      <label class="label" for="region">
        <span class="label-text">region</span>
      </label>
      <input
        bind:value={formModel.region}
        type="text"
        placeholder=""
        class="input input-bordered"
      />
    </div>

    <div class="form-control">
      <label class="label" for="prefix">
        <span class="label-text">prefix</span>
      </label>
      <input
        bind:value={formModel.prefix}
        type="text"
        placeholder=""
        class="input input-bordered"
      />
    </div>
  </div>
</Layout>
