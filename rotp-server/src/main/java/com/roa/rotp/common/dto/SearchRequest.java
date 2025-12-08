package com.roa.rotp.common.dto;

import java.util.List;
import java.util.Optional;

public record SearchRequest(
        Optional<List<String>> fields,
        Optional<String> keyword
) {
    public boolean isValid() {
        return keyword.isPresent() && !keyword.get().isBlank()
                && fields.isPresent() && !fields.get().isEmpty();
    }
}