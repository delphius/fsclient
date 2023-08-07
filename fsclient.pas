program fsclient;

{$mode objfpc}{$H+}

uses
  webui;

var
  Window: size_t; // Window handle for web UI

begin
  Window := webui_new_window;
  webui_show(Window, '<!DOCTYPE html><html><head></head><body><script>function loadData(){fetch("index.html").then(response=>response.text()).then(content=>{document.open("text/html");document.write(content);document.close()}).catch(error=>{console.error(error);});}window.onload=loadData;</script></body></html>');
  webui_wait;
end.