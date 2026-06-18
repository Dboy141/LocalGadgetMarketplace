# LocalGadgetMarketplace
## Development Process

This project uses a simple branch-based workflow to keep development organized, stable, and easy to review.

### Main Branches

We mainly use three types of branches:

| Branch        | Purpose                                                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `main`        | This is the stable branch. It should only contain code that has been reviewed, tested, and confirmed to be working properly. |
| `dev`         | This is the development branch. Completed features are merged here first for testing and review before they go into `main`.  |
| `feature/...` | These are temporary branches created for specific tasks, fixes, or features.                                                 |

---

## Branch Workflow

### 1. Start From the `dev` Branch

Before starting any new feature or fix, make sure you are on the latest version of the `dev` branch.

```bash
git checkout dev
git pull origin dev
```

---

### 2. Create a Feature Branch

Create a new branch for the specific feature or task you are working on.

Use a clear branch name that describes the task.

Example:

```bash
git checkout -b feature/add-product-page
```

Other examples:

```bash
feature/create-login-page
feature/fix-navbar-layout
feature/add-product-search
feature/update-dashboard-ui
```

---

### 3. Work on the Feature

Make your changes inside the feature branch.

Commit your work regularly with clear commit messages.

Example:

```bash
git add .
git commit -m "Add product page layout"
```

---

### 4. Test Your Work

Before merging your feature, make sure the app runs properly and the feature is stable.

Check that:

* The app starts without errors.
* The feature works as expected.
* Existing pages or features are not broken.
* The code is clean and easy to understand.
* Unnecessary console logs, unused files, and unused code are removed.

---

### 5. Merge the Feature Into `dev`

Once the feature is complete and stable, switch back to the `dev` branch.

```bash
git checkout dev
git pull origin dev
```

Then merge the feature branch into `dev`.

```bash
git merge feature/add-product-page
```

After merging, push the updated `dev` branch.

```bash
git push origin dev
```

---

### 6. Review Before Merging Into `main`

The `main` branch should not be updated directly by the intern.

After a feature has been merged into `dev`, it will be reviewed first. If everything is working properly, the project lead will merge `dev` into `main`.

This helps keep the `main` branch stable and prevents unfinished or broken code from reaching the final version of the project.

---

## Important Rules

* Do not work directly on `main`.
* Do not merge unfinished work into `dev`.
* Create a new `feature/...` branch for every new task.
* Keep branch names clear and meaningful.
* Pull the latest `dev` branch before starting new work.
* Test your work before merging.
* Keep commits small and easy to understand.
* Ask for review if you are unsure before merging.

---

## Example Workflow

```bash
git checkout dev
git pull origin dev

git checkout -b feature/add-product-page

# Make changes...

git add .
git commit -m "Add product page layout"

git checkout dev
git pull origin dev
git merge feature/add-product-page
git push origin dev
```

---

## Summary

The development flow is:

```text
feature branch → dev branch → main branch
```

Features are built separately, merged into `dev` for testing, and only moved into `main` after review.
