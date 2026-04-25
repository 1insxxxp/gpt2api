package image

import (
	"encoding/json"
	"strings"
	"testing"
)

func TestToViewUsesProxyURLsForStoredFileIDs(t *testing.T) {
	fileIDs, err := json.Marshal([]string{"sed:file_abc", "file_def"})
	if err != nil {
		t.Fatal(err)
	}
	rawURLs, err := json.Marshal([]string{
		"https://chatgpt.com/backend-api/estuary/content?id=file_abc",
		"https://files.oaiusercontent.com/file_def",
	})
	if err != nil {
		t.Fatal(err)
	}

	view := toView(&Task{
		TaskID:     "img_test",
		Status:     StatusSuccess,
		FileIDs:    fileIDs,
		ResultURLs: rawURLs,
	})

	if len(view.ImageURLs) != 2 {
		t.Fatalf("expected 2 proxy URLs, got %d: %#v", len(view.ImageURLs), view.ImageURLs)
	}
	for i, got := range view.ImageURLs {
		if !strings.HasPrefix(got, "/p/img/img_test/") {
			t.Fatalf("url %d should use local proxy path, got %q", i, got)
		}
		if strings.Contains(got, "chatgpt.com") || strings.Contains(got, "oaiusercontent.com") {
			t.Fatalf("url %d leaked upstream URL: %q", i, got)
		}
		if !strings.Contains(got, "exp=") || !strings.Contains(got, "sig=") {
			t.Fatalf("url %d should include exp and sig, got %q", i, got)
		}
	}
}
