"use client";

import { useState } from "react";
import { ImageGenerator } from "./ImageGenerator";
import { renderPNG } from "./render-png";

export default function Home() {
  const [settings, setSettings] = useState({
    padding: 16,
    shadow: 4,
    radius: 8,
  });
  const [image, setImage] = useState();
  const [loading, setLoading] = useState("idle");

  const setSetting = (name, value) => {
    setSettings((curr) => ({
      ...curr,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const file = files[0];

    if (file.type !== "image/png") {
      alert("On accepte seulement les PNG");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = function () {
      const img = new Image();
      img.src = reader.result;
      img.onload = function () {
        setImage({
          width: img.width,
          height: img.height,
          src: img.src,
          name: file.name,
        });
      };
    };
    reader.readAsDataURL(file);
  };

  const handleDonwload = async (isCopy) => {
    setLoading(isCopy ? "Copie en cours" : "Téléchargement en cours");
    const { blob } = await renderPNG({
      image,
      settings,
    });
    const url = URL.createObjectURL(blob);

    if (isCopy) {
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);
    } else {
      const link = document.createElement("a");
      link.download = image.name.replace(".png", "-elevation.png");
      link.href = url;
      link.click();
    }
    setLoading("idle");
  };

  return (
    <main className="flex justify-center items-center m-auto max-w-4xl max-lg:flex-col gap-8 min-h-full">
      <div class="card flex-1 w-96 bg-base-200 shadow-xl">
        <div class="card-body">
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Pick a file</span>
            </div>
            <input
              type="file"
              class="file-input file-input-info file-input-bordered file-input-sm w-full max-w-xs"
              onChange={handleFileChange}
            />
          </label>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Radius</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.radius}
              onChange={(e) => setSetting("radius", Number(e.target.value))}
              class="range"
              step="5"
            />
          </label>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Shadow</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.shadow}
              onChange={(e) => setSetting("shadow", Number(e.target.value))}
              class="range"
              step="5"
            />
          </label>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Padding</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.padding}
              onChange={(e) => setSetting("padding", Number(e.target.value))}
              class="range"
              step="5"
            />
          </label>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <div
          style={{ maxWidth: 400 }}
          className="flex-1 max-w-md lg:max-w-none overflow-hidden h-fit w-fit flex"
        >
          <ImageGenerator settings={settings} image={image} />
        </div>
      </div>
      <div className="flex gap-4 lg:flex-col">
        <button
          className="btn bg-info border-none"
          disabled={loading !== "idle"}
          onClick={() => handleDonwload(false)}
        >
          Téléchargement{" "}
          {loading === "downloading" ? (
            <span> class=&quot;loading loading-spinner loading-sm&quot;</span>
          ) : null}
        </button>
        <button
          className="btn bg-info border-none"
          disabled={loading !== "idle"}
          onClick={() => handleDonwload(true)}
        >
          Copie{" "}
          {loading === "copying" ? (
            <span> class=&quot;loading loading-spinner loading-sm&quot;</span>
          ) : null}
        </button>
      </div>
    </main>
  );
}
