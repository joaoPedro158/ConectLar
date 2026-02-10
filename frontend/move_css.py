import os
import shutil

base = '/home/carlos/ConectLar/ConectLar/frontend/src'
css_base = os.path.join(base, 'css')
components_dir = os.path.join(base, 'components')
pages_dir = os.path.join(base, 'pages')
css_components_dir = os.path.join(css_base, 'components')
css_pages_dir = os.path.join(css_base, 'pages')

def move_files(src_dir, dst_dir):
    if not os.path.exists(src_dir):
        print(f"Source dir {src_dir} does not exist")
        return
    if not os.path.exists(dst_dir):
        print(f"Dest dir {dst_dir} does not exist")
        return
        
    for filename in os.listdir(src_dir):
        if filename.endswith('.css'):
            src_file = os.path.join(src_dir, filename)
            dst_file = os.path.join(dst_dir, filename)
            try:
                shutil.move(src_file, dst_file)
                print(f"Moved {filename} to {dst_dir}")
            except Exception as e:
                print(f"Error moving {filename}: {e}")

print("Starting move...")
move_files(components_dir, css_components_dir)
move_files(pages_dir, css_pages_dir)

# Move index.css
index_css = os.path.join(base, 'index.css')
dst_index = os.path.join(css_base, 'index.css')
if os.path.exists(index_css):
    try:
        shutil.move(index_css, dst_index)
        print("Moved index.css")
    except Exception as e:
        print(f"Error moving index.css: {e}")
else:
    print("index.css not found in src root")
