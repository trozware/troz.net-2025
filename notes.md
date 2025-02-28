## Notes


## To Do

Tags page not quite how I wanted it, but that will do for now, maybe only show recent tags?
When I try to paginate the tags, I get errors about multiple input files writing to the same output file.

## Image Optimization

Not sure it's worth it, but here's a script to optimize images:

```bash
for xx in */*.jpg; do sips --resampleHeightWidthMax 800 -s format jpeg -s formatOptions 70 $xx; done
for xx in */*.png; do sips --resampleHeightWidthMax 800 $xx; done
```

Got images folder from 44MB to 37MB.
