
# Surge Uploader

This package will permit you to automatically create an HTML page 
with all your projects uploaded to Surge

If you want, you can also upload the page direcly from the CLI

![demo](https://user-images.githubusercontent.com/37043239/153426047-dcf4933e-39f9-41dc-9b10-8d4e31a1c7f1.png)

You can see my generated site **[here](https://bloodcreed21.surge.sh)**


## Installation

Install using npm

```bash
  npm install -g surge-uploader

  surge-uploader
```
    
or you can use npx
```bash
  npx surge-uploader
```

## Documentation

You can find your generate HTML in your home directory
under the folder **surge-uploader**

The CLI will also display the location at the end

You can modify the file and upload it to surge or anywhere you want

### Customization

if you want to edit the template HTML, just run the module once and in your
home_dir a file named **surge-uploader-template.html** will appear,
you can freely edit that file and it will override the base template, to re-obtain the default 
template simply delete **that** file.

Add your styles in the **head**, CSS files will be supported later...


In case you want to customize the links, 
they are organized like **this**:

```html

<ul id="project-list">
    <li class="li-project">
        <a class="a-project" href="#" target="_blank">project</a>
    </li>

    /....../

</ul>

(The path to the template file will also be displayed in the CLI)

```

You can also edit where the link will be generated (and the title)

```html

    <<LINKS>> placeholder for the links
    <<TITLE>> placeholder for the page title

```

