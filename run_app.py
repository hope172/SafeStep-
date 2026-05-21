import http.server
import socketserver
import webbrowser
import threading
import os

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

def open_browser():
    webbrowser.open(f"http://localhost:{PORT}/index.html")

if __name__ == "__main__":
    # Ensure we run in the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    print(f"==================================================")
    print(f" 🌧️  SafeStep v2 Local Launcher starting...")
    print(f" Serving files from: {script_dir}")
    print(f" Web app will open at: http://localhost:{PORT}/index.html")
    print(f"==================================================")
    
    # Open browser after 1 second delay
    threading.Timer(1.0, open_browser).start()
    
    # Start HTTP server
    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(" Server is running. Press Ctrl+C to terminate.")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[!] Shutting down local web server.")
