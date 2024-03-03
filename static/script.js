const uploadFiles = (files, options) => {
  Array.from(files).forEach((file) => {
    const req = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("uploadPath", options.upload_path);
    req.open("POST", options.url, true);
    req.onload = (e) => options.onComplete(e, file);
    req.onerror = (e) => options.onError(e, file);
    req.ontimeout = (e) => options.onAbort(e, file);
    req.upload.onprogress = (e) => options.onProgress(e, file);
    req.onabort = (e) => options.onAbort(e, file);

    req.send(formData);
  });
};

const pathrequest = (files, options) => {
  fetch("/upload-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uploadpath: options.upload_path }),
  }).then(() => {
    uploadTracker(files, options);
  });
};

const uploadTracker = (() => {
  const FILE_STATUS = {
    PENDING: "pending",
    UPLOADING: "uploading",
    COMPLETE: "complete",
    FAILED: "failed",
  };

  const filesMap = new Map();

  const progressBar = document.createElement("div");
  progressBar.className = "upload-progress";
  progressBar.innerHTML = `
        <div class="progress-wrapper"></div>
    `;
  const progressWrapper = progressBar.querySelector(".progress-wrapper");

  const setFileElement = (file) => {
    const fileElement = document.createElement("div");
    fileElement.className = "file-element";
    fileElement.innerHTML = `
        <div class="file-detail">
            <p>
                <span class="filename">${file.name}</span>
                <span class="filestatus">${FILE_STATUS.PENDING}</span>
            </p>
            <div class="progress-bar" style="width:100%; border:1px solid green;"><span class="fill" style="min-width:0;"></span><div>
        </div>
        `;
    filesMap.set(file, {
      status: FILE_STATUS.PENDING,
      size: file.size,
      percentage: 0,
      fileElement,
    });

    progressWrapper.appendChild(fileElement);
  };
  const updateFileElement = (fileObject) => {
    const [
      {
        children: [
          {
            children: [_, filestatus],
          },
          {
            children: [fill],
          },
        ],
      },
    ] = fileObject.fileElement.children;

    requestAnimationFrame(() => {
      filestatus.textContent = fileObject.status + " " + fileObject.percentage;
      filestatus.className = `status ${fileObject.status}`;
      fill.style["min-width"] = fileObject.percentage;
    });
  };

  const onProgress = (e, file) => {
    const fileObject = filesMap.get(file);
    fileObject.status = FILE_STATUS.UPLOADING;
    fileObject.percentage = Math.round((e.loaded / e.total) * 100) + "%";
    updateFileElement(fileObject);
  };
  const onError = (e, file) => {
    const fileObject = filesMap.get(file);
    fileObject.status = FILE_STATUS.FAILED;
    fileObject.percentage = "";
    updateFileElement(fileObject);
  };
  const onAbort = (e, file) => {
    const fileObject = filesMap.get(file);
    fileObject.status = FILE_STATUS.FAILED;
    fileObject.percentage = "";
    updateFileElement(fileObject);
  };
  const onComplete = (e, file) => {
    const fileObject = filesMap.get(file);
    fileObject.status = FILE_STATUS.COMPLETE;
    fileObject.percentage = 100 + "%";
    updateFileElement(fileObject);
  };

  return async (files, options) => {
    [...files].forEach((file) => {
      setFileElement(file);
    });

    uploadFiles(files, {
      onAbort,
      onComplete,
      onError,
      onProgress,
      ...options,
    });
    document.body.appendChild(progressBar);
  };
})();

const uploadForm = document.querySelector("#uploadForm");
const fileSelector = document.querySelector("#file");

let files;

fileSelector.addEventListener("change", (e) => {
  files = e.target.files;
});

uploadForm.addEventListener("submit", (e) => {
  var options = {
    url: "/upload",
    upload_path: "./../files",
  };

  e.preventDefault();
  const folder = e.target.folder.value;

  if (folder) {
    options.upload_path += folder;
  }

  pathrequest(files, options);
});
