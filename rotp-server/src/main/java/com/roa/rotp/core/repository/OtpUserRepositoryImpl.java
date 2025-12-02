package com.roa.rotp.core.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.roa.rotp.admin.dto.otpuser.OtpUserSearchRequest;
import com.roa.rotp.common.util.QuerydslPredicateUtils;
import com.roa.rotp.core.entity.OtpUser;
import com.roa.rotp.core.entity.QOtpUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class OtpUserRepositoryImpl implements CustomOtpUserRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<OtpUser> search(OtpUserSearchRequest request, Pageable pageable) {
        QOtpUser otpUser = QOtpUser.otpUser;
        BooleanBuilder builder = new BooleanBuilder();

        PathBuilder<OtpUser> entityPath = new PathBuilder<>(OtpUser.class, "otpUser");
        QuerydslPredicateUtils.keywordSearch(builder, entityPath, request.keyword(), request.field());
        QuerydslPredicateUtils.eq(builder, otpUser.disabled, request.disabled());
        QuerydslPredicateUtils.between(builder, otpUser.createdAt, request.startDate(), request.endDate());

        // 데이터 조회
        List<OtpUser> content = queryFactory
                .selectFrom(otpUser)
                .where(builder)
                .orderBy(otpUser.createdAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        // 전체 카운트 조회
        long total = Optional.ofNullable(
                queryFactory.select(otpUser.count())
                        .from(otpUser)
                        .where(builder)
                        .fetchOne()
        ).orElse(0L);

        return new PageImpl<>(content, pageable, total);
    }
}
