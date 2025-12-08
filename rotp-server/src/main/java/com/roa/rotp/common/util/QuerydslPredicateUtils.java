package com.roa.rotp.common.util;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.*;

import java.util.List;

@SuppressWarnings("unused")
public class QuerydslPredicateUtils {
    // eq 공통
    public static <T> void eq(BooleanBuilder builder,
                              SimpleExpression<T> path,
                              T value) {
        if (value != null) {
            builder.and(path.eq(value));
        }
    }

    // boolean eq 공통
    public static void eq(BooleanBuilder builder,
                          BooleanExpression path,
                          Boolean value) {
        if (value != null) {
            builder.and(value ? path.isTrue() : path.isFalse());
        }
    }

    // between (날짜 등 Comparable)
    public static <T extends Comparable<?>> void between(BooleanBuilder builder,
                                                         ComparableExpression<T> path,
                                                         T from,
                                                         T to) {
        if (from != null && to != null) {
            builder.and(path.between(from, to));
        } else if (from != null) {
            builder.and(path.goe(from));
        } else if (to != null) {
            builder.and(path.loe(to));
        }
    }

    // like / containsIgnoreCase
    public static void containsIgnoreCase(BooleanBuilder builder,
                                          StringPath path,
                                          String keyword) {
        if (keyword != null && !keyword.isBlank()) {
            builder.and(path.containsIgnoreCase(keyword));
        }
    }

    // fields like '%keyword%'
    public static <T> void keywordSearch(
            BooleanBuilder builder,
            PathBuilder<T> entityPath,
            List<String> fields,
            String keyword
    ) {
        if (keyword == null || keyword.isBlank() || fields == null || fields.isEmpty()) {
            return;
        }

        String likePattern = "%" + keyword + "%";

        BooleanBuilder orBuilder = new BooleanBuilder();
        for (String field : fields) {
            orBuilder.or(entityPath.getString(field).like(likePattern));
        }

        builder.and(orBuilder);
    }
}
