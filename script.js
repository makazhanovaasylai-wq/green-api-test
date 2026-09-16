const API_URL = "https://api.green-api.com";

const $ = (id) => document.getElementById(id);

const idInstanceInput = $("idInstance");
const apiTokenInput = $("apiTokenInstance");
const responseOutput = $("response");

function getCredentials() {
  const idInstance = idInstanceInput.value.trim();
  const apiTokenInstance = apiTokenInput.value.trim();

  if (!idInstance || !apiTokenInstance) {
    throw new Error("Введите idInstance и ApiTokenInstance.");
  }

  return { idInstance, apiTokenInstance };
}

function buildUrl(method) {
  const { idInstance, apiTokenInstance } = getCredentials();

  return `${API_URL}/waInstance${encodeURIComponent(idInstance)}/${method}/${encodeURIComponent(apiTokenInstance)}`;
}

function showResponse(data, status = null) {
  let output = data;

  if (typeof data === "string") {
    try {
      output = JSON.parse(data);
    } catch {
      output = data;
    }
  }

  if (status !== null && typeof output === "object" && output !== null) {
    output = {
      httpStatus: status,
      ...output
    };
  }

  responseOutput.value =
    typeof output === "string"
      ? output
      : JSON.stringify(output, null, 2);
}

function showError(error) {
  showResponse({
    error: true,
    message: error?.message || "Неизвестная ошибка"
  });
}

async function request(method, options = {}) {
  try {
    const url = buildUrl(method);

    const response = await fetch(url, {
      method: options.httpMethod || "GET",
      headers: {
        "Content-Type": "application/json"
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!response.ok) {
      showResponse(
        typeof data === "object" && data !== null
          ? { httpStatus: response.status, ...data }
          : { httpStatus: response.status, response: data }
      );
      return;
    }

    showResponse(data, response.status);
  } catch (error) {
    showError(error);
  }
}

$("getSettings").addEventListener("click", () => {
  request("getSettings");
});

$("getStateInstance").addEventListener("click", () => {
  request("getStateInstance");
});

$("sendMessage").addEventListener("click", () => {
  try {
    const chatIdRaw = $("messageChatId").value.trim();
    const message = $("messageText").value.trim();

    if (!chatIdRaw || !message) {
      throw new Error("Введите номер получателя и текст сообщения.");
    }

    request("sendMessage", {
      httpMethod: "POST",
      body: {
        chatId: normalizeChatId(chatIdRaw),
        message
      }
    });
  } catch (error) {
    showError(error);
  }
});

$("sendFileByUrl").addEventListener("click", () => {
  try {
    const chatIdRaw = $("fileChatId").value.trim();
    const urlFile = $("fileUrl").value.trim();
    const fileName = $("fileName").value.trim();

    if (!chatIdRaw || !urlFile || !fileName) {
      throw new Error("Введите номер получателя, URL файла и имя файла.");
    }

    if (!/^https?:\/\//i.test(urlFile)) {
      throw new Error("URL файла должен начинаться с http:// или https://.");
    }

    if (!/\.[a-z0-9]{1,10}$/i.test(fileName)) {
      throw new Error("Имя файла должно содержать расширение, например horse.png.");
    }

    request("sendFileByUrl", {
      httpMethod: "POST",
      body: {
        chatId: normalizeChatId(chatIdRaw),
        urlFile,
        fileName
      }
    });
  } catch (error) {
    showError(error);
  }
});

function normalizeChatId(value) {
  const trimmed = value.trim();

  // Allows entering either 77771234567 or 77771234567@c.us.
  // Group IDs ending in @g.us are preserved.
  if (trimmed.includes("@")) {
    return trimmed;
  }

  return `${trimmed}@c.us`;
}
