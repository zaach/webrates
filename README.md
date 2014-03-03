webrates
========

Project for [#owfa](https://twitter.com/search?q=%23OWFA&src=hash) hackathon!

Goal: make rate negotiation easier for underrepresented groups in tech.


## Minimal Viable Product

Who: a freelancer negotiating rates.

What: It should answer the question "how much is fair for me to charge for my work?"

Demographics:

* Age
* Experience (in years)
* Gender
* Location of employer
* Your location (prompt if IP differs from above)
* Job Type
  - Designer
  - Developer
  - Product
  - Marketing (?)
* Education
  - Degrees, Schools ?


## Stretch ideas

Additional demographic criteria:
* Orientation
* Existing or new code base ?
* Natural Languages
* Tech used
  - Programming Languages
  - Frameworks
  - Database Software

Features:
* Follow up with an email
* API


## Prior Art

* [angel.co](http://angel.co)
* [yourrate.co](http://www.yourrate.co/)

## Developing

The app is just static HTML; all you need to do is serve the local directory.
Note that we're developing on the `gh-pages` branch.

1. fork this repo
2. `git clone`
3. `git checkout gh-pages`
4. `python -m SimpleHTTPServer`

Stylesheets are written with [Compass](http://compass-style.org/)+[SASS](http://sass-lang.com/), compiled, and checked into this repo.
If you want to make a change, see the `sass/` directory.
You can generate the CSS files with `compass compile`.

## License
MIT
