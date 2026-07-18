# Mobile Home Experience Design

## Scope

Integrate the approved mobile story experience into the official home page at viewports up to 760px. Keep the existing desktop home page unchanged above that breakpoint and remove the review-only preview routes before release.

## Experience

- Use a single immersive mobile viewport with three horizontally switchable stories.
- Keep the first story focused on companionship with lightweight signal labels only.
- Show the complete App panel only in the second story.
- Keep the third story focused on family and professional collaboration without repeating the App panel.
- Use one primary command per story and a quieter text link for the secondary path.
- Keep the manual controls in the lower-right safe area.
- Auto-advance every five seconds, pause while the user interacts, and disable auto-advance when reduced motion is requested.
- Support touch/pointer swipe in addition to explicit selector buttons.

## Editorial Continuation

- Continue below the immersive hero as a mobile-first editorial journey instead of a uniform card grid.
- Open with a product close-up and a three-step record-to-care path.
- Present safety, long-term observation, and professional collaboration as three chapters with full, inset, and edge-aligned image geometry.
- Use a full-bleed family scene to reset the rhythm before the deep-green trust principles band.
- Close with the App download path and the existing global footer.
- Keep every generated image unique within the journey and pair it with the required AI concept-art disclosure.
- Link image chapters and text commands to their real product, research, solution, privacy, and download routes.

## Assets And Claims

- Reuse existing public photographic assets and existing design-system components.
- Do not add new product claims, metrics, customer names, institutions, or medical promises.
- Keep the required AI concept-art disclosure visible but visually subordinate.

## Validation

- Unit-test three-story rendering, second-story App-panel visibility, manual switching, and reduced-motion behavior.
- Verify the official home route at 390 x 844, 360 x 800, 320 x 568, and a 1440px desktop viewport.
- Confirm no horizontal overflow, no text overlap, no subject-face obstruction, and 44px minimum primary touch targets.
- Unit-test the three editorial chapters, destination links, image alternatives, and one-to-one AI disclosure coverage.
- Render every lazy image before visual capture and confirm no broken assets at 390 x 844 and 320 x 568.
- Inspect section screenshots and a full-page rhythm overview; correct narrow-screen orphaned Chinese characters before handoff.

## Rollback

The release remains fully reversible through Git. Revert the mobile-home integration commit to restore the previous responsive home page; no generated production artifact needs to be edited by hand.
