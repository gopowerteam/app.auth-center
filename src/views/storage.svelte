<script>
  import Layout from './layout.svelte'

  export let storages

  /**
   * 删除应用
   */
  function onDelete(id) {
    if (window.confirm('是否确定删除?')) {
      fetch(`/config/storage/${id}`, {
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
  <title>存储授权</title>
</svelte:head>

<Layout path="storage">
  <div class="action text-right p-5">
    <a href="/storage-form">
      <button class="btn btn-sm btn-info">创建存储</button
      ></a
    >
  </div>
  <div class="content">
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th />
            <th>存储名称</th>
            <th>存储类型</th>
            <th>应用桶</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {#each storages as storage, index}
            <tr>
              <th>{index + 1}</th>
              <th>{storage.name}</th>
              <td>{storage.bucket}</td>
              <td>{storage.type}</td>
              <td>
                <button class="btn btn-link">
                  <a
                    class="link link-primary"
                    href="/storage-form/{storage.id}"
                    >编辑</a
                  >
                </button>

                <button
                  class="btn btn-link"
                  on:click={() => onDelete(storage.id)}
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
