package com.roa.rotp.common.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@Table(name = "audit_log")
@AllArgsConstructor
public class AuditLog extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;
    private String result;
    private String message;

    private String ipAddress;
    private String userAgent;
    private String requestUri;
    private String httpMethod;

    @Column(length = 4000)
    private String requestPayload;

    public static final List<String> SEARCHABLE_FIELDS =
            List.of("userAgent", "ipAddress", "requestUri");

    public AuditLog() {}
}