for file in *
do
  cwebp -q 80 "$file" -o "$file.webp"
done
