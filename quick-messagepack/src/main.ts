import "../node_modules/water.css/out/water.css";
import "./style.css";
import { encode, decode } from "@msgpack/msgpack";

document.getElementById("json")?.addEventListener("change", async (e) => {
    const file = (e as any).target.files[0] as File;
    const decoder = new TextDecoder("utf-8");
    const json = decoder.decode(await file.arrayBuffer());

    let parsedJson;
    try {
        parsedJson = JSON.parse(json);
    } catch {
        alert("Error parsing JSON.");
        (e as any).target.value = null;
        return;
    }

    const buffer = encode(parsedJson);

    downloadArrayBuffer(buffer, getFileNameWithoutExtension(file.name) + ".msgp");

    (e as any).target.value = null;
});

document.getElementById("msgp")?.addEventListener("change", async (e) => {
    const file = (e as any).target.files[0] as File;
    const buffer = await file.arrayBuffer();

    let json;
    try {
        json = decode(buffer);
    } catch {
        alert("Error decoding MessagePack.");
        (e as any).target.value = null;
        return;
    }

    const stringJson = JSON.stringify(json, null, 4);
    const textEncoder = new TextEncoder();
    const jsonBuffer = textEncoder.encode(stringJson);

    downloadArrayBuffer(jsonBuffer, getFileNameWithoutExtension(file.name) + ".json");

    (e as any).target.value = null;
});

function getFileNameWithoutExtension(name: string) {
    const parts = name.split(".");
    parts.pop();
    return parts.join();
}

const filesContainer = document.getElementById("files");

function downloadArrayBuffer(buffer: ArrayBuffer, name: string) {
    const blob = new Blob([buffer]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.innerText = name;
    link.href = url;
    link.download = name;

    (filesContainer as any).hidden = false;
    filesContainer?.append(link);
    filesContainer?.append(document.createElement("br"));
    link.click();
}
