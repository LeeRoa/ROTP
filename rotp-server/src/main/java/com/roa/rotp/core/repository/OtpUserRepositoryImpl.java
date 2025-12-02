package com.roa.rotp.core.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.roa.rotp.admin.dto.otpuser.OtpUserSearchRequest;
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
public class OtpUserRepositoryImpl implements CustomUserOtpSecretRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<OtpUser> search(OtpUserSearchRequest request, Pageable pageable) {
        QOtpUser u = QOtpUser.otpUser;
        BooleanBuilder builder = new BooleanBuilder();

        // 동적 조건
        if (hasText(request.userId()))    builder.and(u.userId.containsIgnoreCase(request.userId()));


        // 데이터 조회
        List<OtpUser> content = queryFactory
                .selectFrom(u)
                .where(builder)
                .orderBy(u.createdAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        // 전체 카운트 조회
        long total = Optional.ofNullable(
                queryFactory.select(u.count())
                        .from(u)
                        .where(builder)
                        .fetchOne()
        ).orElse(0L);

        return new PageImpl<>(content, pageable, total);
    }

    private boolean hasText(String s) {
        return s != null && !s.isBlank();
    }
}
