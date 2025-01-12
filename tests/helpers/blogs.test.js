const Page = require("./helpers/page");
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("When logged in", async () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");

    test("can see blog create form", async () => {
      const label = await page.getContentsOf("form label");

      expect(label).toEqual("Blog Title");
    });
  });
});

describe("And using valid inputs", async () => {
  beforeEach(async () => {
    await page.type(".title input", "My Title");
    await page.type(".content input", "My Content");

    await page.click("form button");
  });
  test("Submitting takes user to review screen", async () => {
    const text = await page.getContentsOf("h5");
    expect(text).toEqual("Please confirm your entries");
  });
  test("Submitting then saving addos blog to index page!", async () => {});
});

describe("And using inavalid inpuuts", async () => {
  beforeEach(async () => {
    await page.click("form button");
  });

  test("the from shows an error message", async () => {
    const titleError = await page.getContentsOf(".title .red-text");
    const contentError = await page.getContentsOf(".content .red-text");

    expect(titleError).toEqual("You must provide a value");
    expect(contentError).toEqual("You must provide a value");
  });
});

test("User cannot create blog post", async () => {
  const result = page.evaluate(() => {
    fetch("/pai/blogs", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Conetnt-Type": "application/json",
      },
      body: JSON.stringify({ title: "My Title", content: "My content" }),
    }).then((res) => res.json());

    console.log(result);
    expect(result).toEqual({ error: "You must log in!" });
  });

  test("User cannnot get a list of posts", async () => {
    const result = page.evaluate(() => {
      return fetch("/api/blogs", {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    });

    expect(result).toEqual({ error: "You must log in!" });
  });
});
