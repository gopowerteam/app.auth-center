<script>
  import Layout from './layout.svelte'

  export let apps

  function onDelete(id) {
    if (window.confirm('Do you really want to leave?')) {
      fetch(`/config/app/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(({ ok }) => {
        if (ok) {
          alert('删除成功')
          location.reload()
        }
      })
    }
  }
</script>

<svelte:head>
  <title>登录授权</title>
</svelte:head>

<Layout path="login">
  <div class="action text-right p-5">
    <a href="/app-form">
      <button class="btn btn-sm btn-info">创建应用</button
      ></a
    >
  </div>
  <div class="content">
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th />
            <th>应用名称</th>
            <th>应用ID</th>
            <th>应用类型</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {#each apps as app, index}
            <tr>
              <th>{index + 1}</th>
              <th>{app.name}</th>
              <td>{app.appid}</td>
              <td>{app.type}</td>
              <td>
                <button class="btn btn-link">
                  <a
                    class="link link-primary"
                    href="/app-form/{app.id}">编辑</a
                  >
                </button>

                <button
                  class="btn btn-link"
                  on:click={() => onDelete(app.id)}
                  >删除</button
                >
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</Layout>
