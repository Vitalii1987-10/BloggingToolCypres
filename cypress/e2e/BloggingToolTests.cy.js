// Test to visit the localhost URL
describe("Localhost Test", () => {
  it("should visit localhost:3000", () => {
    cy.visit("http://localhost:3000/");
  });
});

// Test for interacting with the user card
describe("User Card Interaction", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  // Test to click the "Open" button on the first card
  it('should click the "Open" button on the first card', () => {
    cy.get('[data-testid="card-1"]').find('[data-testid="button-1"]').click();

    // Verify the URL change
    cy.url().should("include", "/author/1/blogs");
  });
});

// Test for the "Create New Blog" button
describe("Create New Blog Button", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/author/1/blogs");
  });

  // Test to navigate to the new blog creation page
  it("should navigate to the new blog creation page when clicked", () => {
    cy.url().should("match", /\/author\/\d+\/blogs/);

    cy.get(".create-new-blog-button").click();

    // Verify the URL change
    cy.url().should("include", "/create-new-blog");
  });
});

// Test for the new blog creation page elements
describe("Create New Blog Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/author/1/create-new-blog");
  });

  // Test to check form elements are rendered correctly
  it("should render the form elements correctly", () => {
    cy.get(".blog-title-input").should("exist");
    cy.get(".blog-author-input").should("exist");
    cy.get(".blog-category-form").should("exist");
    cy.get(".blog-category-select").should("exist");
    cy.get(".create-blog-submit-button").should("exist");
  });

  // Test to submit the form and navigate to blogs page
  it("should navigate to the blogs page upon form submission", () => {
    cy.url().should("match", /\/author\/\d+\/create-new-blog/);

    cy.get(".blog-title-input").type("My New Blog");
    cy.get(".blog-author-input").type("Author Name");

    // Open the Select menu
    cy.get(".blog-category-select").click();

    // Select the category option
    cy.get('li[data-value="Technology"]').click();

    cy.get(".create-blog-submit-button").click();

    // Verify the URL change
    cy.url().should("include", "/author/1/blogs");

    // Assert the new blog is listed on the page
    cy.contains("My New Blog").should("exist");
    cy.contains("Technology").should("exist");
  });
});

// Test to delete a blog
describe("Delete Blog", () => {
  before(() => {
    // Ensure a new blog is created before running the test
    cy.visit("http://localhost:3000/author/1/blogs");

    // Verify the new blog is created and visible
    cy.url().should("include", "/author/1/blogs");
    cy.contains("My New Blog").should("exist");
    cy.contains("Technology").should("exist");
  });

  // Test to delete the blog and verify it no longer exists
  it("should delete a blog and assert it no longer exists", () => {
    cy.url().should("match", /\/author\/\d+\/blogs/);

    // Ensure the blog is visible before deletion
    cy.contains("My New Blog").should("exist");

    // Click the delete button for the specific blog
    cy.contains("My New Blog").parent().get(".delete-blog-button").click();

    // Confirm the deletion if a dialog appears
    cy.on("window:confirm", (text) => {
      expect(text).to.contains("Are you sure you want to delete this blog?");
      return true;
    });

    // Verify the blog no longer exists on the page
    cy.contains("My New Blog").should("not.exist");
  });
});

// Test for the new blog creation page elements
describe("Create New Blog Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/author/1/create-new-blog");
  });

  // Test to check form elements are rendered correctly
  it("should render the form elements correctly", () => {
    cy.get(".blog-title-input").should("exist");
    cy.get(".blog-author-input").should("exist");
    cy.get(".blog-category-form").should("exist");
    cy.get(".blog-category-select").should("exist");
    cy.get(".create-blog-submit-button").should("exist");
  });

  // Test to submit the form and navigate to blogs page
  it("should navigate to the blogs page upon form submission", () => {
    cy.url().should("match", /\/author\/\d+\/create-new-blog/);

    cy.get(".blog-title-input").type("My Blog to Edit");
    cy.get(".blog-author-input").type("Author Name");

    // Open the Select menu
    cy.get(".blog-category-select").click();

    // Select the category option
    cy.get('li[data-value="Technology"]').click();

    cy.get(".create-blog-submit-button").click();

    // Verify the URL change
    cy.url().should("include", "/author/1/blogs");

    // Assert the new blog is listed on the page
    cy.contains("My Blog to Edit").should("exist");
    cy.contains("Technology").should("exist");
  });
});

// Test for editing a blog
describe("Edit Blog Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/author/1/blogs");
  });

  // Test to edit a blog and verify changes
  it("should edit a blog and assert that changes are applied", () => {
    // Find the card with the title "My Blog to Edit" and locate the edit button within it
    cy.contains("My Blog to Edit").get(".edit-blog-button").click();

    // Update blog details
    cy.get(".edit-blog-title-input input").clear().type("My Edited Blog");
    cy.get(".edit-blog-author-input input").clear().type("Updated Author");
    cy.get(".edit-blog-category-select").click();
    cy.get('li[data-value="Science"]').click();
    cy.get(".edit-blog-submit-button").click();

    // Verify the URL change
    cy.url().should("include", "/author/1/blogs");

    // Assert the blog details are updated on the page
    cy.contains("My Edited Blog").should("exist");
    cy.contains("Science").should("exist");
  });
});

// Test for navigating from a blog card to its articles
describe("Blog Card To Articles Interaction", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/author/1/blogs");
  });

  // Test to go to articles for "My Edited Blog"
  it('should go to articles for "My Edited Blog"', () => {
    // Find the card with the title "My Blog to Edit" and locate the edit button within it
    cy.contains("My Edited Blog").get(".to-articles-button").click();

    // Verify the URL change
    cy.url().should("match", /\/author\/\d+\/blog\/\d+\/articles/);
  });
});

// Test to create a new article
describe("Create a new article", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/author/1/blogs");
  });

  // Test to create a new draft article
  it("should create a new draft article", () => {
    cy.contains("My Edited Blog").get(".to-articles-button").click();

    cy.url().should("match", /\/author\/\d+\/blog\/\d+\/articles/);

    cy.get(".create-new-article-button").click();

    cy.url().should("match", /\/author\/\d+\/blog\/\d+\/create-new-article/);

    // Data to for the article
    cy.get(".article-title-input").type("Title Draft Test");
    cy.get(".article-author-input").type("Author Name");
    cy.get(".article-status-select").click();
    cy.get('li[data-value="Draft"]').click();
    cy.get(".article-content-input").type(
      "This is the content of the new draft article."
    );

    // Submit the form
    cy.get(".create-article-submit-button").click();

    // Verify the URL change
    cy.url().should("match", /\/author\/\d+\/blog\/\d+\/articles/);

    // Assert the new article is listed on the page
    cy.contains("Title Draft Test").should("exist");
  });

  // Test to create a new published article
  it("should create a new published article", () => {
    cy.contains("My Edited Blog").get(".to-articles-button").click();

    cy.url().should("match", /\/author\/\d+\/blog\/\d+\/articles/);

    cy.get(".create-new-article-button").click();

    cy.url().should("match", /\/author\/\d+\/blog\/\d+\/create-new-article/);

    // Data to for the article
    cy.get(".article-title-input").type("Title Published Test");
    cy.get(".article-author-input").type("Author Name");
    cy.get(".article-status-select").click();
    cy.get('li[data-value="Published"]').click();
    cy.get(".article-content-input").type(
      "This is the content of the new published article."
    );

    // Submit the form
    cy.get(".create-article-submit-button").click();

    // Verify the URL change
    cy.url().should("match", /\/author\/\d+\/blog\/\d+\/articles/);

    // Assert the new article is listed on the page
    cy.contains("Title Published Test").should("exist");
  });
});

// Test for moving cards between Draft and Published states
describe("Move Cards from Draft to Published and vice versa", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/author/1/blogs");
  });

  // Test to move a card from Draft to Published
  it("should move a card from Draft to Published", () => {
    // Navigate to articles page for the selected blog
    cy.contains("My Edited Blog").get(".to-articles-button").click();

    // Verify the URL is correct
    cy.url().should("match", /\/author\/\d+\/blog\/\d+\/articles/);

    // Ensure there is at least one draft card
    cy.get(".draft-card").should("exist");

    // Click the button to publish the first draft card
    cy.get(".draft-card")
      .first()
      .within(() => {
        cy.get(".publish-article-button").click();
      });

    // Verify the card now appears in the published section
    cy.get(".published-card").should("contain", "Title Draft Test");
  });

  // Test to move a card from Published to Draft
  it("should move a card from  Published to Draft", () => {
    // Navigate to articles page for the selected blog
    cy.contains("My Edited Blog").get(".to-articles-button").click();

    // Verify the URL is correct
    cy.url().should("match", /\/author\/\d+\/blog\/\d+\/articles/);

    // Ensure there is at least one published card
    cy.get(".published-card").should("exist");

    // Click the button to move the second published card to draft
    cy.get(".published-card")
      .eq(1)
      .within(() => {
        cy.get(".unpublish-article-button").click();
      });

    // Verify the card now appears in the draft section
    cy.get(".draft-card").should("contain", "Title Published Test");
  });
});

// Test for deleting an article
describe("Delete an article", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/author/1/blogs");
  });

  // Test to delete an article from the draft section
  it("should delete an article", () => {
    // Navigate to articles page for the selected blog
    cy.contains("My Edited Blog").get(".to-articles-button").click();

    // Verify the URL is correct
    cy.url().should("match", /\/author\/\d+\/blog\/\d+\/articles/);

    // Ensure there is at least one draft card
    cy.get(".draft-card").should("exist");

    // Verify the card exists in the draft section
    cy.get(".draft-card").should("contain", "Title Published Test");

    // Click the button to delete the first draft card
    cy.get(".draft-card")
      .first()
      .within(() => {
        cy.get(".delete-article-button").click();
      });

    // Verify the card no longer exists in the draft section
    cy.contains(".draft-card", "Title Published Test").should("not.exist");
  });
});

// Test for editing an article
describe("Edit Article page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/author/1/blogs");
  });

  // Test to edit an article and verify that changes are applied
  it("should edit an article and assert that changes are applied ", () => {
    // Navigate to articles page for the selected blog
    cy.contains("My Edited Blog").get(".to-articles-button").click();

    // Verify the URL is correct
    cy.url().should("match", /\/author\/\d+\/blog\/\d+\/articles/);

    // Ensure there is at least one published card
    cy.get(".published-card").should("exist");

    // Click the button to move the first published card to draft
    cy.get(".published-card")
      .first()
      .within(() => {
        cy.get(".unpublish-article-button").click();
      });

    // Ensure there is at least one draft card
    cy.get(".draft-card").should("exist");

    // Click the button to edit the first draft card
    cy.get(".draft-card")
      .first()
      .within(() => {
        cy.get(".edit-article-button").click();
      });

    // Ensure the article form is loaded
    cy.get(".article-title-input").should("be.visible");

    // Update article details
    cy.get(".article-title-input input").clear().type("Updated Title");
    cy.get(".article-author-input input").clear().type("Updated Author");
    cy.get(".article-content-input input")
      .clear({ multiple: true, force: true })
      .type("Updated Content", { force: true });

    // Submit the form
    cy.get(".update-article-button").click();

    // Verify the URL has changed to the articles page
    cy.url().should("match", /\/author\/\d+\/blog\/\d+\/articles/);

    // Verify the updated content is displayed on the articles page
    cy.contains("Updated Title").should("exist");
  });
});

// Test for moving a card from Draft to Published (duplicate of the previous test, consider merging or removing)
describe("Move Card from Draft to Published", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/author/1/blogs");
  });

  // Test to move a card from Draft to Published
  it("should move a card from Draft to Published", () => {
    // Navigate to articles page for the selected blog
    cy.contains("My Edited Blog").get(".to-articles-button").click();

    // Verify the URL is correct
    cy.url().should("match", /\/author\/\d+\/blog\/\d+\/articles/);

    // Ensure there is at least one draft card
    cy.get(".draft-card").should("exist");

    // Click the button to publish the first draft card
    cy.get(".draft-card")
      .first()
      .within(() => {
        cy.get(".publish-article-button").click(); // Adjust selector if needed
      });

    // Verify the card now appears in the published section
    cy.get(".published-card").should("contain", "Updated Title");
  });
});

// Test for navigating to the reader page
describe("Open reader page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/reader/1/blogs");
  });

  // Test to ensure the reader page URL is correct
  it("should include the correct link", () => {
    // Verify the URL is correct
    cy.url().should("include", "/reader/1/blogs");
  });
});

// Test for opening a blog page for a reader
describe("Open reader blog page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/reader/1/blogs");
  });

  // Test to open a specific blog and verify its content
  it("should open a blog for a reader", () => {
    // Click the button to open the blog
    cy.contains("My Edited Blog").get(".reader-open-blog-button").click();

    // Verify the URL is correct
    cy.url().should("match", /\/reader\/\d+\/blog\/\d+\/articles/);

    // Verify the blog articles are listed
    cy.get(".reader-article-card").should("contain", "Updated Title");
  });
});

// Test for opening a specific article page for a reader
describe("Open reader article page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/reader/1/blogs");
  });

  // Test to open a specific article and verify its content
  it("should open a blog for a reader", () => {
    // Click the button to open the blog
    cy.contains("My Edited Blog").get(".reader-open-blog-button").click();

    // Verify the URL is correct
    cy.url().should("match", /\/reader\/\d+\/blog\/\d+\/articles/);

    cy.get(".reader-article-card").should("contain", "Updated Title");

    // Click the button to open the specific article
    cy.contains("Updated Title").get(".reader-open-article-button").click();

    // Verify the URL for the specific article
    cy.url().should("match", /\/reader\/\d+\/blog\/\d+\/article\/\d+/);
  });
});
