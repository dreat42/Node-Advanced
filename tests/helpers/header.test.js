const Page = require("./page");

let page;

beforeEach(async () => {
  page = await Page.build();

  await pages.goto("localhost:3000");
});

afterEach(async () => {
  await page.close();
});

test("We can launch a browser", async () => {
  const text = await page.getContentsOF("a.brand-logo");

  expect(text).toEqual("Blogster");
});

test("clicking login starts oauth flow", async () => {
  await page.click(".right a");

  const url = await page.url();

  expect(url).toMatch(/accounts\.google.com/);
});

test("When signed in, shows logout button", async () => {
  const text = await page.$eval('a[href="/auth/log', (el) => el.innerHTML);
  await page.login();
  expect(text).toEqual("Logout");
});
