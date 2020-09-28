This is a pull request (PR) used to demo the [GitHub Flow](https://guides.github.com/introduction/flow/) with an example that is more appealing than a standard hello world web app. This PR

* adds a welcome sign to the Octocat generator with a custom text (allows to showcase our graphical diffing capabilities)
![image](https://user-images.githubusercontent.com/1872314/59567763-31f01580-9072-11e9-9794-c7bd3fea84fa.png)
* changes some html for changed text (demonstrate inline-edit functionality and suggested changes feature appealing to designers)
![image](https://user-images.githubusercontent.com/26060123/59352339-aba99b80-8d20-11e9-88ca-64198f4a564f.png)

The project is hooked to a multi stage deployment pipeline that will create a review environment for every single pull request and the ability to promote to staging and production. This allows us to show case GitHub Actions, our integration with CI/CD like Heroku and Azure Pipelines and branch protection rules with commit status checks.

Furthermore,  the master branch will automatically push to the associated GitHub pages site, giving us an opportunity to explain what Jekyll and GitHub pages are.

![image](https://user-images.githubusercontent.com/1872314/59351139-fd9cf200-8d1d-11e9-8657-1059be1ee3e3.png)
