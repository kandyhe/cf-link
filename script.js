const demoList = document.getElementById("demo-list");
const searchInput = document.getElementById("search");

// 加载 JSON 数据
async function fetchDemos() {
  const response = await fetch("./demos.json");
  return response.json();
}

// 检查外网状态
async function checkStatus(url) {
  try {
    const response = await fetch(url, { method: "HEAD", mode: "no-cors" });
    return response.ok ? "在线" : "离线";
  } catch {
    return "未知";
  }
}

// 渲染 Demo 列表
async function renderList(demos) {
  demoList.innerHTML = "";
  for (const demo of demos) {
    const status = demo.url.startsWith("http") ? await checkStatus(demo.url) : "内网";
    demoList.innerHTML += `
      <div class="p-4 border rounded bg-white">
        <h2 class="font-bold">${demo.name}</h2>
        <p><a href="${demo.url}" target="_blank" class="text-blue-500">${demo.url}</a></p>
        <p class="text-sm text-gray-600">状态: <span class="${status === "在线" ? "text-green-500" : "text-red-500"}">${status}</span></p>
        <p class="text-sm text-gray-600">${demo.notes}</p>
        <p class="text-sm text-gray-600">标签: ${demo.tags.join(", ")}</p>
      </div>
    `;
  }
}

// 搜索功能
function filterList(keyword, demos) {
  const filtered = demos.filter(demo =>
    demo.name.toLowerCase().includes(keyword) ||
    demo.tags.some(tag => tag.toLowerCase().includes(keyword))
  );
  renderList(filtered);
}

// 初始化
async function init() {
  const demos = await fetchDemos();
  renderList(demos);

  // 搜索事件
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    filterList(keyword, demos);
  });
}

init();
